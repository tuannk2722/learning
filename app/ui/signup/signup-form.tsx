'use client';
import { Eye, EyeOff, Lock, Mail, Sparkles, Trophy, User, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { register, signInWithGoogle } from "@/app/lib/actions/auth";
import { useActionState, useState } from "react";
import { ButtonFacebook, ButtonGoogle } from "../button";

export function SignUpForm() {
  const [errorMessage, formAction, isPending] = useActionState(register, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl"
    >

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h2>
      <p className="text-gray-600 mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
          Log in
        </Link>
      </p>

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fullname
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled={isPending}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={isPending}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              disabled={isPending}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              disabled={isPending}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${formData.confirmPassword.length > 0
                ? passwordsMatch
                  ? 'border-emerald-500 focus:border-emerald-600'
                  : 'border-rose-400 focus:border-rose-500'
                : 'border-gray-200 focus:border-violet-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              required
            />
            {formData.confirmPassword.length > 0 && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
            )}
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !passwordsMatch}
          aria-disabled={isPending}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isPending ? 'Creating...' : 'Create an account'}
        </button>

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>

      <div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6">
          <form action={signInWithGoogle} className="w-full">
            <ButtonGoogle className="w-full" type="submit" disabled={isPending} />
          </form>
          {/* <form action={signInWithGoogle} className="w-full">
            <ButtonFacebook className="w-full" type="submit" disabled={isPending} />
          </form> */}
        </div>
      </div>
    </motion.div>
  )
}
