"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { userSignInSchema } from "@/lib/validations";

export default function SignInPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Zod validation
    const validation = userSignInSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/student/dashboard");
      }
    } else {
      setError(res.message || "Failed to sign in");
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md space-y-8">
        {/* Header with Official 3D Metallic MG Emblem */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="relative h-16 w-16 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="MGSolutions Official Logo"
                className="h-full w-auto object-contain drop-shadow-[0_2px_12px_rgba(59,130,246,0.4)]"
              />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Sign In to MGSolutions
          </h2>
          <p className="text-xs text-slate-400">
            Access your account across OrginTech, EdTech, and BBS.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mgsolutions.com or student@mgsolutions.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-blue-400 hover:text-blue-300">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                Remember credentials for 30 days
              </label>
            </div>

            <Button type="submit" isLoading={loading} className="w-full font-semibold gap-2 h-11 text-sm bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 shadow-lg">
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* OAuth Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800/80 text-sm font-medium text-slate-200 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Workspace</span>
          </button>

          {/* Footer switch */}
          <div className="text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/auth/signup" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign Up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
