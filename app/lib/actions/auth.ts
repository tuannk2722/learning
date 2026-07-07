'use server';

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { password_reset_tokens } from "../db/schema";
import { sendPasswordResetEmail } from "../email";
import { logActivity } from "./activity-log";

export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) return { success: false, error: "Email already exists!" };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
    }).returning({ id: users.id });

    // Log registration event
    void logActivity({
      userId: newUser?.id ?? null,
      action: 'USER_REGISTER',
      entityType: 'user',
      entityName: name,
      metadata: { email },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to register user:', error);
    return { success: false, error: "System error. Cannot create account right now." };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email or Password is not correct.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function handleLogout() {
  await signOut({ redirectTo: '/' });
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let isRegisterSuccess = false;

  try {
    const result = await registerUser(name, email, password);

    if (!result.success) {
      return result.error;
    }

    isRegisterSuccess = true;
  } catch (error) {
    return "System error. Cannot create account right now.";
  }

  if (isRegisterSuccess) {
    redirect('/login');
  }
}

export async function signInWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard/courses' });
}

export async function requestPasswordReset(
  prevState: { success: boolean; message: string } | undefined,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();

  // Luôn trả về thông báo thành công để tránh lộ thông tin email tồn tại hay không
  const genericSuccess = { success: true, message: 'If this email is registered, you will receive a reset link shortly.' };

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResult.length === 0 || !userResult[0].password_hash) {
      return genericSuccess;
    }

    const user = userResult[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    // Xoá token cũ, tạo token mới
    await db.delete(password_reset_tokens).where(eq(password_reset_tokens.user_id, user.id));
    await db.insert(password_reset_tokens).values({ user_id: user.id, token, expires_at: expiresAt });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);

    return genericSuccess;
  } catch (error) {
    console.error('requestPasswordReset error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function resetPassword(
  prevState: { success: boolean; message: string } | undefined,
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token) return { success: false, message: 'Invalid or missing token.' };
  if (password !== confirmPassword) return { success: false, message: 'Passwords do not match.' };
  if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };

  try {
    const tokenResult = await db
      .select()
      .from(password_reset_tokens)
      .where(eq(password_reset_tokens.token, token))
      .limit(1);

    if (tokenResult.length === 0) {
      return { success: false, message: 'This link is invalid or has already been used.' };
    }

    const resetToken = tokenResult[0];

    if (new Date() > resetToken.expires_at) {
      await db.delete(password_reset_tokens).where(eq(password_reset_tokens.id, resetToken.id));
      return { success: false, message: 'This link has expired. Please request a new one.' };
    }

    const newHash = await bcrypt.hash(password, 10);
    await db.update(users).set({ password_hash: newHash }).where(eq(users.id, resetToken.user_id));
    await db.delete(password_reset_tokens).where(eq(password_reset_tokens.id, resetToken.id));

    return { success: true, message: 'Your password has been reset successfully. Please log in.' };
  } catch (error) {
    console.error('resetPassword error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
