"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnboardingStore } from "../../store/onboardingStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";

const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  type: z.string().min(2, "Restaurant type is required"),
  address: z.string().min(4, "Restaurant address is required"),
  openingHours: z.string().min(4, "Opening hours are required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.email("Enter a valid email address"),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

export function RestaurantInfoForm() {
  const router = useRouter();
  const { restaurantInfo, setRestaurantInfo } = useOnboardingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurantInfo,
  });

  const onSubmit = (values: RestaurantFormValues) => {
    setRestaurantInfo(values);
    router.push("/onboarding/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
      <p className="font-bold text-neutral-500">Step 2/4</p>
      <h1 className="mt-1 text-2xl font-bold text-neutral-800">Tell Us About Your Restaurant</h1>
      <p className="mt-1 text-base font-semibold text-neutral-600">
        Add your restaurant details so we can set up your profile and help you start managing your business.
      </p>
      <div className="mt-3 h-px bg-neutral-200" />

      <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
        <Input label="Restaurant Name" placeholder="e.g. Taste of Kigali" error={errors.name?.message} {...register("name")} />
        <label className="block">
          <span className="mb-1 block text-base font-semibold text-black">Restaurant Type</span>
          <span className="relative block">
            <select
              className="h-11 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-4 text-base font-semibold text-neutral-500 outline-none focus:border-[#22c51f] focus:ring-4 focus:ring-green-100"
              {...register("type")}
            >
              <option value="">Select cuisine type</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Casual Dining">Casual Dining</option>
              <option value="Cafe">Cafe</option>
              <option value="Quick Service">Quick Service</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={20} />
          </span>
          {errors.type?.message ? <span className="mt-1 block text-sm text-red-600">{errors.type.message}</span> : null}
        </label>
        <Input label="Restaurant Address" placeholder="Street, City, Country" error={errors.address?.message} {...register("address")} />
        <Input label="Opening Hours" placeholder="e.g. 08:00 - 22:00" error={errors.openingHours?.message} {...register("openingHours")} />
        <PhoneInput placeholder="+250 7XX XXX XXX" error={errors.phone?.message} {...register("phone")} />
        <Input label="Email" type="email" placeholder="restaurant@email.com" error={errors.email?.message} {...register("email")} />
      </div>

      <label className="mt-4 grid min-h-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/20 text-center transition hover:bg-green-50">
        <input type="file" className="sr-only" accept="image/*" />
        <span className="flex flex-col items-center justify-center py-2">
          <Upload className="text-[#22c51f]" size={20} />
          <span className="mt-1 block text-base font-bold">Click to Upload your restaurant Logo</span>
          <span className="mt-1 block text-sm font-medium text-neutral-400">Max 100mb filesize</span>
        </span>
      </label>

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="h-11 px-8">Next</Button>
      </div>
    </form>
  );
}
