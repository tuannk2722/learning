import { LoginBranding } from "../../ui/login/branding";
import { LoginForm } from "../../ui/login/login-form";

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
