"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnboardingStore } from "../../store/onboardingStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";

const ownerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(7, "Phone number is required"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

export function OwnerInfoForm() {
  const router = useRouter();
  const { ownerInfo, setOwnerInfo } = useOnboardingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: ownerInfo,
  });

  const onSubmit = (values: OwnerFormValues) => {
    setOwnerInfo(values);
    router.push("/onboarding/step-2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
      <p className="font-bold text-neutral-500">Step 1/4</p>
      <h1 className="mt-1 text-2xl font-bold text-neutral-800">Restaurant Owner Info</h1>
      <p className="mt-1 text-base font-semibold text-neutral-600">
        Set up your account to manage your restaurant. This information is used to access your dashboard.
      </p>
      <div className="mt-3 h-px bg-neutral-200" />

      <div className="mt-4 grid gap-4 lg:grid-cols-[210px_1fr]">
        <div>
          <p className="text-base font-semibold leading-snug text-neutral-600">
            Let&apos;s get to know you! Share your details so we can set up your restaurant account.
          </p>
          <Link href="/privacy" className="mt-4 inline-flex items-center text-sm font-bold text-[#22c51f]">
            Terms &amp; Privacy Policy
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="First Name" placeholder="eg. John" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last Name" placeholder="eg. Park" error={errors.lastName?.message} {...register("lastName")} />
          <div className="md:col-span-2">
            <Input label="Email Address" type="email" placeholder="Enter your email address" error={errors.email?.message} {...register("email")} />
          </div>
          <div className="md:col-span-2">
            <PhoneInput placeholder="+250 784 955 081" error={errors.phone?.message} {...register("phone")} />
          </div>
          <div className="relative md:col-span-2">
            <Input label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} {...register("password")} />
            <Eye size={20} className="absolute bottom-4 right-4 text-neutral-700" />
          </div>
          <div className="md:col-span-2">
            <div className="my-2 flex items-center gap-8 text-center text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="font-bold">or</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
            <Button type="button" variant="outline" className="h-11 w-full border-neutral-200 text-black">
              <span className="text-3xl font-bold text-[#4285f4]">G</span> Sign Up with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit" className="h-11 px-8">Next</Button>
      </div>
    </form>
  );
}
