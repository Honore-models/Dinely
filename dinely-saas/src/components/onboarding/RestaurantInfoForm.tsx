"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";
import { uploadApi } from "@/lib/api";

const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  type: z.string().min(2, "Restaurant type is required"),
  address: z.string().min(4, "Restaurant address is required"),
  openingHours: z.string().min(4, "Opening hours are required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Enter a valid email address"),
  logo: z.string().optional(),
  description: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

export function RestaurantInfoForm() {
  const router = useRouter();
  const { restaurantInfo, setRestaurantInfo } = useOnboardingStore();
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(restaurantInfo.logo || "");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurantInfo,
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file);
      setValue("logo", url, { shouldValidate: true });
      setLogoPreview(url);
    } catch {
      // Upload failed silently – logo is optional
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (values: RestaurantFormValues) => {
    setRestaurantInfo({ ...values, logo: values.logo || "" } as typeof restaurantInfo);
    router.push("/onboarding/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <p className="font-bold text-neutral-500">Step 2/4</p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-800">Tell Us About Your Restaurant</h1>
      <p className="mt-1 text-base font-semibold text-neutral-600">
        Add your restaurant details so we can set up your profile and help you start managing your business.
      </p>
      <div className="mt-4 h-px bg-neutral-200" />

      <div className="mt-6 grid gap-x-12 gap-y-5 md:grid-cols-2">
        <Input
          label="Restaurant Name"
          placeholder="e.g. Taste of Kigali"
          error={errors.name?.message}
          {...register("name")}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-neutral-700">
            Restaurant Type
          </span>
          <span className="relative block">
            <select
              className="h-12 w-full appearance-none rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 text-sm text-neutral-700 outline-none transition focus:border-[#22c51f] focus:ring-2 focus:ring-green-100/80"
              {...register("type")}
            >
              <option value="">Select cuisine type</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Casual Dining">Casual Dining</option>
              <option value="Cafe">Cafe</option>
              <option value="Quick Service">Quick Service</option>
              <option value="Burgers & American">Burgers &amp; American</option>
              <option value="Pizza & Italian">Pizza &amp; Italian</option>
              <option value="Japanese & Sushi">Japanese &amp; Sushi</option>
              <option value="African Cuisine">African Cuisine</option>
              <option value="Indian Cuisine">Indian Cuisine</option>
              <option value="Bakery & Pastry">Bakery &amp; Pastry</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
          </span>
          {errors.type?.message && (
            <span className="mt-1 block text-sm text-red-600">{errors.type.message}</span>
          )}
        </label>

        <Input
          label="Restaurant Address"
          placeholder="Street, City, Country"
          error={errors.address?.message}
          {...register("address")}
        />
        <Input
          label="Opening Hours"
          placeholder="e.g. 08:00 - 22:00"
          error={errors.openingHours?.message}
          {...register("openingHours")}
        />

        {/* Phone with Controller */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              placeholder="+250 7XX XXX XXX"
              error={errors.phone?.message}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Input
          label="Email"
          type="email"
          placeholder="restaurant@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="md:col-span-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">
              Description <span className="text-neutral-400">(optional)</span>
            </span>
            <textarea
              placeholder="Tell customers what makes your restaurant special..."
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-2 focus:ring-green-100/80"
              {...register("description")}
            />
          </label>
        </div>
      </div>

      {/* Logo upload */}
      <label className="mt-4 grid min-h-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/20 text-center transition hover:bg-green-50">
        <input
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleLogoUpload}
          disabled={uploading}
        />
        <span className="flex flex-col items-center justify-center py-5 px-10">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoPreview}
              alt="Logo preview"
              className="mx-auto mb-2 h-16 w-16 rounded-xl object-cover ring-2 ring-green-200"
            />
          ) : (
            <Upload className="text-[#22c51f]" size={20} />
          )}
          <span className="mt-1 block text-base font-bold">
            {uploading
              ? "Uploading…"
              : logoPreview
              ? "Click to change logo"
              : "Click to Upload your restaurant Logo"}
          </span>
          <span className="mt-1 block text-sm font-medium text-neutral-400">
            Max 5 MB · JPEG, PNG, WebP
          </span>
        </span>
      </label>

      <div className="mt-8 flex justify-end">
        <Button type="submit" className="h-11 px-8">Next</Button>
      </div>
    </form>
  );
}
