import Link from "next/link";
import { Mail, LockKeyhole, User } from "lucide-react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthFormPanel } from "../../../components/auth/AuthFormPanel";
import { AuthGoogleButton } from "../../../components/auth/AuthGoogleButton";
import { AuthHero } from "../../../components/auth/AuthHero";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">
      <AuthHero description="Create your account and start managing orders, menus, and staff from one place." />

      <AuthFormPanel
        wide
        title="Create your account"
        subtitle="Set up your owner profile to get started with Dinely."
        footer={
          <p className="text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
              Sign in
            </Link>
          </p>
        }
      >
        <form className="mt-7 grid gap-5 sm:grid-cols-2">
          <Input label="First name" placeholder="John" icon={<User size={18} />} />
          <Input label="Last name" placeholder="Park" icon={<User size={18} />} />
          <div className="sm:col-span-2">
            <Input
              label="Email address"
              type="email"
              placeholder="you@restaurant.com"
              icon={<Mail size={18} />}
            />
          </div>
          <div className="sm:col-span-2">
            <PhoneInput placeholder="+250 784 955 081" />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={<LockKeyhole size={18} />}
            />
          </div>
          <Button className="h-12 w-full rounded-lg text-sm sm:col-span-2">Create account</Button>
          <div className="sm:col-span-2">
            <AuthDivider />
          </div>
          <div className="sm:col-span-2">
            <AuthGoogleButton label="Continue with Google" />
          </div>
        </form>
      </AuthFormPanel>
    </main>
  );
}
