import { Metadata } from 'next';
import { LoginBranding } from '@/app/ui/login/branding';
import { ForgotPasswordForm } from '@/app/ui/forgot-password/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password | Gamified Learning',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <LoginBranding />

        {/* Right Side - Form */}
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
