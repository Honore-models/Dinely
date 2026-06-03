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
      subtitle="Sign in to your restaurant dashboard."
      footer={
        <p className="text-center text-xs text-neutral-600 sm:text-sm">
          New to Dinely?{" "}
          <Link href="/register" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Create account
          </Link>
        </p>
      }
    >
      <form className="space-y-3.5">
        <Input
          size="compact"
          label="Email address"
          type="email"
          placeholder="owner@restaurant.com"
          icon={<Mail size={16} />}
        />
        <Input
          size="compact"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<LockKeyhole size={16} />}
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
        <Button className="h-10 w-full rounded-lg text-sm">Sign in</Button>
        <AuthDivider />
        <AuthGoogleButton label="Continue with Google" />
      </form>
    </AuthFormPanel>
  );
}
