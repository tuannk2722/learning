import { SignUpBranding } from "@/app/ui/signup/branding";
import { SignUpForm } from "@/app/ui/signup/signup-form";

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
