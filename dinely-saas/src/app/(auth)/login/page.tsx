import Image from "next/image";
import Link from "next/link";
import { Mail, LockKeyhole } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-[#165b24] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Image src="/logo.svg" alt="Dinely" width={150} height={58} className="brightness-0 invert" priority />
        <div>
          <h1 className="max-w-md text-5xl font-bold leading-tight">Run every restaurant shift from one clean dashboard.</h1>
          <p className="mt-6 max-w-md text-lg text-green-50">
            Track bookings, orders, menus, and guest activity without losing focus on service.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-neutral-950">Welcome back</h2>
          <p className="mt-2 font-semibold text-neutral-500">Sign in to continue managing your restaurant.</p>
          <form className="mt-8 space-y-5">
            <Input label="Email Address" type="email" placeholder="owner@restaurant.com" icon={<Mail size={19} />} />
            <Input label="Password" type="password" placeholder="Enter your password" icon={<LockKeyhole size={19} />} />
            <div className="flex items-center justify-between text-sm font-semibold">
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 accent-[#22c51f]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#22c51f]">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full">Sign in</Button>
            <Button type="button" variant="outline" className="w-full border-neutral-200 text-black">
              <span className="text-2xl font-bold text-[#4285f4]">G</span> Sign in with Google
            </Button>
          </form>
          <p className="mt-8 text-center font-semibold text-neutral-600">
            New to Dinely?{" "}
            <Link href="/register" className="text-[#22c51f]">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
