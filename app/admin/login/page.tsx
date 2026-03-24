"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary-400 -rotate-45" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-stone-900">HABN Admin</h1>
              <p className="text-sm text-stone-500">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                placeholder="admin@habnstudio.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-700">
              ← Back to site
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-stone-500">
          Super Admin: admin@habnstudio.com | Branch: branch email / branch123
        </p>
      </div>
    </div>
  );
}
