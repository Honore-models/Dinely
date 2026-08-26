"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { User, Mail, LockKeyhole } from "lucide-react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { authApi } from "@/lib/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";

const ownerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

export function OwnerInfoForm() {
  const router = useRouter();
  const { ownerInfo, setOwnerInfo } = useOnboardingStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: ownerInfo,
    mode: "onTouched",
  });

  const password = watch("password");

  const onSubmit = async (values: OwnerFormValues) => {
    setSubmitError(null);
    setOwnerInfo(values);

    try {
      await authApi.register(values);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      // If account already exists, allow proceeding (user may have refreshed)
      if (!msg.includes("already exists") && !msg.includes("already have")) {
        setSubmitError(msg || "Failed to create account. Please try again.");
        return;
      }
    }

    router.push("/onboarding/step-2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
      <p className="text-sm font-bold text-neutral-400">Step 1 of 4</p>
      <h1 className="mt-2 text-2xl font-extrabold text-neutral-900">
        Restaurant Owner Info
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Set up your account to manage your restaurant. This information is used
        to access your dashboard.
      </p>
      <div className="mt-4 h-px bg-neutral-100" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Left sidebar */}
        <div>
          <p className="text-sm leading-relaxed text-neutral-500">
            Let&apos;s get to know you! Share your details so we can set up
            your restaurant account.
          </p>
          <Link
            href="/privacy"
            className="mt-4 inline-flex items-center text-sm font-bold text-[#22c51f] hover:underline"
          >
            Terms &amp; Privacy Policy
          </Link>
        </div>

        {/* Form fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(errors).length > 0 || submitError) && (
            <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError || "Please fix the errors below before continuing."}
            </div>
          )}

          <Input
            label="First Name"
            placeholder="e.g. John"
            icon={<User size={16} />}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Park"
            icon={<User size={16} />}
            error={errors.lastName?.message}
            {...register("lastName")}
          />

          <div className="md:col-span-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  placeholder="+250 784 955 081"
                  error={errors.phone?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<LockKeyhole size={16} />}
              error={errors.password?.message}
              {...register("password")}
            />
            {/* Password strength indicator */}
            {password && password.length > 0 && (
              <div className="mt-2 flex gap-1.5">
                {[
                  { test: password.length >= 8, label: "8+ chars" },
                  { test: /[A-Z]/.test(password), label: "Uppercase" },
                  { test: /[0-9]/.test(password), label: "Number" },
                ].map((rule) => (
                  <span
                    key={rule.label}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      rule.test
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {rule.test ? "✓" : "·"} {rule.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Next Step"}
        </Button>
      </div>
    </form>
  );
}
