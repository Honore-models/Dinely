import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BillingCycle = "yearly" | "monthly";
export type PlanName = "Starter" | "Professional" | "Enterprise";

export interface OwnerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RestaurantInfo {
  name: string;
  type: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
  logo?: string;
  description?: string;
}

interface OnboardingState {
  ownerInfo: OwnerInfo;
  restaurantInfo: RestaurantInfo;
  selectedPlan: PlanName;
  billingCycle: BillingCycle;
  setOwnerInfo: (ownerInfo: OwnerInfo) => void;
  setRestaurantInfo: (restaurantInfo: RestaurantInfo) => void;
  setSelectedPlan: (selectedPlan: PlanName) => void;
  setBillingCycle: (billingCycle: BillingCycle) => void;
}

const emptyOwnerInfo: OwnerInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

const emptyRestaurantInfo: RestaurantInfo = {
  name: "",
  type: "",
  address: "",
  openingHours: "",
  phone: "",
  email: "",
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ownerInfo: emptyOwnerInfo,
      restaurantInfo: emptyRestaurantInfo,
      selectedPlan: "Professional",
      billingCycle: "yearly",
      setOwnerInfo: (ownerInfo) => set({ ownerInfo }),
      setRestaurantInfo: (restaurantInfo) => set({ restaurantInfo }),
      setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
      setBillingCycle: (billingCycle) => set({ billingCycle }),
    }),
    { name: "dinely-onboarding" },
  ),
);
