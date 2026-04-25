'use server';

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) return { success: false, error: "Email already exists!" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
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
