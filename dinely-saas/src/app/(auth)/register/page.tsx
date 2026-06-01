import Image from "next/image";
import Link from "next/link";
import { Mail, LockKeyhole, User } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { PhoneInput } from "../../../components/ui/PhoneInput";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-[#165b24] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Image src="/logo.svg" alt="Dinely" width={150} height={58} className="brightness-0 invert" priority />
        <div>
          <h1 className="max-w-md text-5xl font-bold leading-tight">Create your restaurant command center.</h1>
          <p className="mt-6 max-w-md text-lg text-green-50">
            Set up your owner profile, add your restaurant, and choose the plan that fits your team.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold text-neutral-950">Create account</h2>
          <p className="mt-2 font-semibold text-neutral-500">Start with your owner details.</p>
          <form className="mt-8 grid gap-5 md:grid-cols-2">
            <Input label="First Name" placeholder="eg. John" icon={<User size={19} />} />
            <Input label="Last Name" placeholder="eg. Park" icon={<User size={19} />} />
            <div className="md:col-span-2">
              <Input label="Email Address" type="email" placeholder="Enter your email address" icon={<Mail size={19} />} />
            </div>
            <div className="md:col-span-2">
              <PhoneInput placeholder="+250 784 955 081" />
            </div>
            <div className="md:col-span-2">
              <Input label="Password" type="password" placeholder="Enter your password" icon={<LockKeyhole size={19} />} />
            </div>
            <Button className="md:col-span-2 w-full">Create account</Button>
            <Button type="button" variant="outline" className="md:col-span-2 w-full border-neutral-200 text-black">
              <span className="text-2xl font-bold text-[#4285f4]">G</span> Sign up with Google
            </Button>
          </form>
          <p className="mt-8 text-center font-semibold text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#22c51f]">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
