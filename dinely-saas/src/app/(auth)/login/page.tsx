import Link from "next/link";
import { Mail, LockKeyhole } from "lucide-react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthFormPanel } from "../../../components/auth/AuthFormPanel";
import { AuthGoogleButton } from "../../../components/auth/AuthGoogleButton";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function LoginPage() {
  return (
    <AuthFormPanel
      title="Welcome back"
      subtitle="Sign in to manage your restaurant, orders, and team."
      footer={
        <p className="text-center text-sm text-neutral-600">
          New to Dinely?{" "}
          <Link href="/register" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Create account
          </Link>
        </p>
      }
    >
      <form className="mt-7 space-y-5">
        <Input label="Email address" type="email" placeholder="owner@restaurant.com" icon={<Mail size={18} />} />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<LockKeyhole size={18} />}
        />
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 text-neutral-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-[#22c51f] focus:ring-[#22c51f]/30"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-[#22c51f] hover:text-[#1bad1a]">
            Forgot password?
          </Link>
        </div>
        <Button className="h-12 w-full rounded-lg text-sm">Sign in</Button>
        <AuthDivider />
        <AuthGoogleButton label="Continue with Google" />
      </form>
    </AuthFormPanel>
  );
}
