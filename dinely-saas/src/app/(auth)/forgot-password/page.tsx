import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form className="w-full max-w-md rounded-xl border border-neutral-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="mt-2 font-semibold text-neutral-500">Enter your email and we will send reset instructions.</p>
        <div className="mt-6">
          <Input label="Email Address" type="email" placeholder="owner@restaurant.com" />
        </div>
        <Button className="mt-6 w-full">Send reset link</Button>
        <Link href="/login" className="mt-5 block text-center font-bold text-[#22c51f]">
          Back to login
        </Link>
      </form>
    </main>
  );
}
