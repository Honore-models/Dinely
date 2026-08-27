"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Upload, Store } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PhoneInput } from "../ui/PhoneInput";
import { uploadApi } from "@/lib/api";

const restaurantSchema = z.object({
  name: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name is too long"),
  type: z.string().min(1, "Please select a cuisine type"),
  address: z
    .string()
    .min(4, "Address must be at least 4 characters")
    .max(200, "Address is too long"),
  openingHours: z
    .string()
    .min(3, "Opening hours are required (e.g. 08:00 - 22:00)"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long"),
  email: z.string().email("Please enter a valid email address"),
  logo: z.string().optional(),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional(),
  website: z.string().optional(),
  capacity: z.string().optional(),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

const cuisineTypes = [
  "Fine Dining",
  "Casual Dining",
  "Fast Casual",
  "Cafe",
  "Quick Service",
  "Burgers & American",
  "Pizza & Italian",
  "Japanese & Sushi",
  "African Cuisine",
  "Indian Cuisine",
  "Mexican Cuisine",
  "Chinese Cuisine",
  "Bakery & Pastry",
  "Bar & Grill",
  "Other",
];

export function RestaurantInfoForm() {
  const router = useRouter();
  const { restaurantInfo, setRestaurantInfo } = useOnboardingStore();
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(
    restaurantInfo.logo || "",
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      ...restaurantInfo,
      description: restaurantInfo.description || "",
    },
    mode: "onTouched",
  });

  const description = watch("description") || "";

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file);
      setValue("logo", url, { shouldValidate: true });
      setLogoPreview(url);
    } catch {
      // Upload failed silently - logo is optional
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (values: RestaurantFormValues) => {
    setRestaurantInfo({
      ...values,
      logo: values.logo || "",
      description: values.description || "",
      website: values.website || "",
      capacity: values.capacity || "",
    });
    router.push("/onboarding/step-3");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
      <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500">Step 2 of 4</p>
      <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 dark:text-white">
        Tell Us About Your Restaurant
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Add your restaurant details so we can set up your profile and help you
        start managing your business.
      </p>
      <div className="mt-4 h-px bg-neutral-100 dark:bg-neutral-800" />

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Please fix the errors below before continuing.
        </div>
      )}

      <div className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
        <Input
          label="Restaurant Name"
          placeholder="e.g. Taste of Kigali"
          icon={<Store size={16} />}
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Styled Select */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Cuisine Type
          </span>
          <span className="relative block">
            <select
              className={`h-12 w-full appearance-none rounded-lg border bg-neutral-50/50 px-4 pr-10 text-sm text-neutral-700 outline-none transition focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900 dark:focus:ring-green-900 ${
                errors.type
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-900"
                  : "border-neutral-200"
              }`}
              {...register("type")}
            >
              <option value="">Select cuisine type</option>
              {cuisineTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
          </span>
          {errors.type?.message && (
            <span className="mt-1 block text-xs text-red-500 dark:text-red-400">
              {errors.type.message}
            </span>
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
              ref={field.ref}
            />
          )}
        />

        <Input
          label="Restaurant Email"
          type="email"
          placeholder="restaurant@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Website"
          placeholder="https://yourrestaurant.com"
          error={errors.website?.message}
          {...register("website")}
        />

        <Input
          label="Seating Capacity"
          placeholder="e.g. 50 seats"
          error={errors.capacity?.message}
          {...register("capacity")}
        />

        {/* Styled Textarea */}
        <div className="md:col-span-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Description <span className="text-neutral-400 dark:text-neutral-500">(optional)</span>
            </span>
            <textarea
              placeholder="Tell customers what makes your restaurant special..."
              rows={3}
              maxLength={500}
              className={`w-full resize-none rounded-lg border bg-neutral-50/50 px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900 dark:focus:ring-green-900 ${
                errors.description
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-900"
                  : "border-neutral-200"
              }`}
              {...register("description")}
            />
            <span className="mt-1 block text-right text-xs text-neutral-400 dark:text-neutral-500">
              {description.length}/500
            </span>
          </label>
          {errors.description?.message && (
            <span className="mt-1 block text-xs text-red-500 dark:text-red-400">
              {errors.description.message}
            </span>
          )}
        </div>
      </div>

      {/* Logo upload */}
      <label className="mt-5 grid min-h-[120px] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/20 text-center transition hover:bg-green-50 dark:border-green-900 dark:bg-green-950/20 dark:hover:bg-green-950/40">
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
              className="mx-auto mb-2 h-16 w-16 rounded-xl object-cover ring-2 ring-green-200 dark:ring-green-800"
            />
          ) : (
            <Upload className="text-[#22c51f]" size={22} />
          )}
          <span className="mt-1 block text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {uploading
              ? "Uploading…"
              : logoPreview
                ? "Click to change logo"
                : "Upload your restaurant logo"}
          </span>
          <span className="mt-1 block text-xs text-neutral-400 dark:text-neutral-500">
            Max 5 MB · JPEG, PNG, WebP
          </span>
        </span>
      </label>

      <div className="mt-6 flex justify-end">
        <Button type="submit" size="lg" loading={isSubmitting} loadingText="Saving...">
          Next Step
        </Button>
      </div>
    </form>
  );
}
