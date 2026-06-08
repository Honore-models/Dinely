"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, LockKeyhole, User } from "lucide-react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthFormPanel } from "../../../components/auth/AuthFormPanel";
import { AuthGoogleButton } from "../../../components/auth/AuthGoogleButton";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";
import { useAuth } from "../../../hooks/useAuth";

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <AuthFormPanel
      wide
      title="Create your account"
      subtitle="Set up your owner profile in under a minute."
      footer={
        <p className="text-center text-xs text-neutral-600 sm:text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="grid grid-cols-2 gap-x-3 gap-y-2.5 max-[700px]:gap-y-2" onSubmit={handleSubmit}>
        {error && (
          <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Input size="compact" label="First name" placeholder="John" icon={<User size={16} />} value={form.firstName} onChange={set("firstName")} required />
        <Input size="compact" label="Last name" placeholder="Park" icon={<User size={16} />} value={form.lastName} onChange={set("lastName")} required />
        <div className="col-span-2">
          <Input size="compact" label="Email address" type="email" placeholder="you@restaurant.com" icon={<Mail size={16} />} value={form.email} onChange={set("email")} required />
        </div>
        <div className="col-span-2">
          <PhoneInput size="compact" placeholder="+250 784 955 081" value={form.phone} onChange={set("phone")} required />
        </div>
        <div className="col-span-2">
          <Input size="compact" label="Password" type="password" placeholder="Create a strong password" icon={<LockKeyhole size={16} />} value={form.password} onChange={set("password")} required />
        </div>
        <Button type="submit" className="col-span-2 h-10 w-full rounded-lg text-sm" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <div className="col-span-2">
          <AuthDivider />
        </div>
        <div className="col-span-2">
          <AuthGoogleButton label="Continue with Google" />
        </div>
      </form>
    </AuthFormPanel>
  );
}
