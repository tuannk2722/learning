'use server';

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { registerUser } from "@/auth";
import { redirect } from "next/navigation";

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
