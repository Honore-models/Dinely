"use client";

import Link from "next/link";
import { useState } from "react";
import { LockKeyhole, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { DinelyLogo } from "@/components/brand/DinelyLogo";

export default function CustomerRegisterPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <DinelyLogo width={120} height={42} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-neutral-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Join Dinely to explore and order from the best restaurants.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Robert"
                icon={<User size={16} />}
                value={form.firstName}
                onChange={set("firstName")}
                required
              />
              <Input
                label="Last name"
                placeholder="Fisher"
                icon={<User size={16} />}
                value={form.lastName}
                onChange={set("lastName")}
                required
              />
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              value={form.email}
              onChange={set("email")}
              required
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="+250 784 000 000"
              value={form.phone}
              onChange={set("phone")}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<LockKeyhole size={16} />}
              value={form.password}
              onChange={set("password")}
              required
            />

            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-sm"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#22c51f] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-neutral-400">
            Want to list your restaurant?{" "}
            <Link
              href="/register"
              className="font-semibold text-neutral-600 hover:underline"
            >
              Register as owner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
