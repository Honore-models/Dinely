import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthFormPanel } from "../../../components/auth/AuthFormPanel";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function ForgotPasswordPage() {
  return (
    <AuthFormPanel
      title="Reset password"
      subtitle="Enter your email and we will send you reset instructions."
      footer={
        <p className="text-center text-sm text-neutral-600">
          <Link href="/login" className="font-semibold text-[#22c51f] hover:text-[#1bad1a]">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form className="mt-7 space-y-5">
        <Input label="Email address" type="email" placeholder="owner@restaurant.com" icon={<Mail size={18} />} />
        <Button className="h-12 w-full rounded-lg text-sm">Send reset link</Button>
      </form>
    </AuthFormPanel>
  );
}
