"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { AuthFormPanel } from "@/components/auth/AuthFormPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: implement actual password-reset email logic
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <AuthFormPanel
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <p className="text-center text-xs text-neutral-600 sm:text-sm">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Sign in
          </Link>
        </p>
      }
    >
      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          If an account exists with <strong>{email}</strong>, a reset link has been sent.
        </div>
      ) : (
        <form className="space-y-3.5" onSubmit={handleSubmit}>
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
          <Button
            className="h-10 w-full rounded-lg text-sm"
            type="submit"
            loading={loading}
            loadingText="Sending..."
          >
            Send reset link
          </Button>
        </form>
      )}
    </AuthFormPanel>
  );
}
