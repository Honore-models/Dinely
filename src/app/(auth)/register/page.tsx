"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, LockKeyhole, User, UtensilsCrossed } from "lucide-react";
import { AuthFormPanel } from "@/components/auth/AuthFormPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { registerCustomer, loading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const set =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerCustomer(form);
  };

  return (
    <AuthFormPanel
      wide
      title="Create your account"
      subtitle="Join Dinely to explore and order from the best restaurants."
      footer={
        <div className="space-y-2 text-center">
          <p className="text-xs text-neutral-600 sm:text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-neutral-600 sm:text-sm">
            Own a restaurant?{" "}
            <Link
              href="/onboarding/step-1"
              className="inline-flex items-center gap-1 font-semibold text-neutral-700 hover:text-neutral-900"
            >
              <UtensilsCrossed size={13} />
              Register as owner
            </Link>
          </p>
        </div>
      }
    >
      <form className="grid grid-cols-2 gap-x-3 gap-y-3" onSubmit={handleSubmit}>
        {error && (
          <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Input
          size="compact"
          label="First name"
          placeholder="Robert"
          icon={<User size={16} />}
          value={form.firstName}
          onChange={set("firstName")}
          required
        />
        <Input
          size="compact"
          label="Last name"
          placeholder="Fisher"
          icon={<User size={16} />}
          value={form.lastName}
          onChange={set("lastName")}
          required
        />
        <div className="col-span-2">
          <Input
            size="compact"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={set("email")}
            required
          />
        </div>
        <div className="col-span-2">
          <Input
            size="compact"
            label="Phone number"
            type="tel"
            placeholder="+250 784 000 000"
            value={form.phone}
            onChange={set("phone")}
            required
          />
        </div>
        <div className="col-span-2">
          <Input
            size="compact"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            icon={<LockKeyhole size={16} />}
            value={form.password}
            onChange={set("password")}
            required
          />
        </div>
        <Button
          type="submit"
          className="col-span-2 h-10 w-full rounded-lg text-sm"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthFormPanel>
  );
}
