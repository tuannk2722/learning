import { LoginBranding } from '@/app/ui/login/branding';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ResetPasswordForm } from '@/app/ui/reset-password/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password | LearnQuest',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Next.js 15: searchParams là Promise, phải await trước khi dùng
  const { token } = await searchParams;

  if (!token) redirect('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <LoginBranding />
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
