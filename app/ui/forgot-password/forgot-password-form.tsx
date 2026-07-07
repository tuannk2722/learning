'use client';

import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useActionState } from 'react';
import { requestPasswordReset } from '@/app/lib/actions/auth';

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    undefined as { success: boolean; message: string } | undefined,
  );

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          If that email is registered, a password reset link has been sent. Check your spam folder if you don&apos;t see it.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h2>
      <p className="text-gray-500 mb-8 leading-relaxed text-sm">
        Enter the email address associated with your account and we&apos;ll send you a reset link.
      </p>

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        {state?.success === false && (
          <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? 'Sending...' : 'Send reset link'}
        </button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
