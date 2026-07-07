'use client';

import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { resetPassword } from '@/app/lib/actions/auth';

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    undefined as { success: boolean; message: string } | undefined,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Password updated!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Your password has been changed successfully. You can now log in with your new password.
        </p>
        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Go to login
          <ArrowRight className="w-5 h-5" />
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
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset password</h2>
      <p className="text-gray-500 mb-8 leading-relaxed text-sm">
        Choose a strong, unique password to protect your account.
      </p>

      <form action={formAction} className="space-y-5">
        {/* Hidden token field — passed from server */}
        <input type="hidden" name="token" value={token} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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
          {isPending ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </motion.div>
  );
}
