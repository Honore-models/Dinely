"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Mail, LockKeyhole } from "lucide-react";
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
        <div className="space-y-2 text-center">
          <p className="text-xs text-neutral-600 sm:text-sm">
            New owner?{" "}
            <Link href="/register" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Register restaurant
            </Link>
          </p>
          <p className="text-xs text-neutral-600 sm:text-sm">
            New customer?{" "}
            <Link href="/register-customer" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Create account
            </Link>
          </p>
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
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <AuthDivider />
        <AuthGoogleButton label="Continue with Google" />
      </form>
    </AuthFormPanel>
  );
}
