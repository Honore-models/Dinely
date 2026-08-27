"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Mail, LockKeyhole, User, UtensilsCrossed } from "lucide-react";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthFormPanel } from "@/components/auth/AuthFormPanel";
import { AuthGoogleButton } from "@/components/auth/AuthGoogleButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, redirect);
  };

  return (
    <AuthFormPanel
      title="Welcome back"
      subtitle="Sign in to your Dinely account."
      footer={
        <div className="space-y-3 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Sign up
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register-customer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <User size={13} />
              Customer
            </Link>
            <Link
              href="/onboarding/step-1"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <UtensilsCrossed size={13} />
              Restaurant Owner
            </Link>
          </div>
        </div>
      }
    >
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Input
          size="compact"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          size="compact"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<LockKeyhole size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-[#22c51f] hover:text-[#1bad1a]">
            Forgot password?
          </Link>
        </div>
        <Button
          className="h-10 w-full rounded-lg text-sm"
          type="submit"
          loading={loading}
          loadingText="Signing in..."
        >
          Sign in
        </Button>
        <AuthDivider />
        <AuthGoogleButton label="Continue with Google" />
      </form>
    </AuthFormPanel>
  );
}
