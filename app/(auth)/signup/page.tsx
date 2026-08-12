import type { Metadata } from "next";
import { SignUpBranding } from "@/app/ui/signup/branding";
import { SignUpForm } from "@/app/ui/signup/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free Learning account and start your learning journey today.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <SignUpBranding />

        {/* Right Side - Register Form */}
        <SignUpForm />
      </div>
    </div>
  );
}
