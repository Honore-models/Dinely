import Link from "next/link";
import { Mail, LockKeyhole, User } from "lucide-react";
import { AuthDivider } from "../../../components/auth/AuthDivider";
import { AuthFormPanel } from "../../../components/auth/AuthFormPanel";
import { AuthGoogleButton } from "../../../components/auth/AuthGoogleButton";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";

const compact = "compact" as const;
const icon = 16;

export default function RegisterPage() {
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
      <form className="grid grid-cols-2 gap-x-3 gap-y-2.5 max-[700px]:gap-y-2">
        <Input size={compact} label="First name" placeholder="John" icon={<User size={icon} />} />
        <Input size={compact} label="Last name" placeholder="Park" icon={<User size={icon} />} />
        <div className="col-span-2">
          <Input
            size={compact}
            label="Email address"
            type="email"
            placeholder="you@restaurant.com"
            icon={<Mail size={icon} />}
          />
        </div>
        <div className="col-span-2">
          <PhoneInput size={compact} placeholder="+250 784 955 081" />
        </div>
        <div className="col-span-2">
          <Input
            size={compact}
            label="Password"
            type="password"
            placeholder="Create a strong password"
            icon={<LockKeyhole size={icon} />}
          />
        </div>
        <Button className="col-span-2 h-10 w-full rounded-lg text-sm">Create account</Button>
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
