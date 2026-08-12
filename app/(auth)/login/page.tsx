import type { Metadata } from "next";
import { LoginBranding } from "../../ui/login/branding";
import { LoginForm } from "../../ui/login/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Learning account to continue your learning journey.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <LoginBranding />

        {/* Right Side - Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
