import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthFormPanel } from "@/components/auth/AuthFormPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  return (
    <AuthFormPanel
      title="Reset password"
      subtitle="We will email you a link to reset your password."
      footer={
        <p className="text-center text-xs text-neutral-600 sm:text-sm">
          <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Back to sign in
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
        <Button className="h-10 w-full rounded-lg text-sm">Send reset link</Button>
      </form>
    </AuthFormPanel>
  );
}
