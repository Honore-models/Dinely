"use client";

import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { ShieldCheck, Bell, CreditCard, Zap, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurant } from "@/hooks/useRestaurant";

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {readOnly ? (
        <p className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {value || "—"}
        </p>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#22c51f] focus:ring-2 focus:ring-green-100"
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { restaurant, update: updateRestaurant } = useRestaurant();

  // Owner info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Restaurant info state
  const [restName, setRestName] = useState("");
  const [restType, setRestType] = useState("");
  const [restAddress, setRestAddress] = useState("");
  const [restPhone, setRestPhone] = useState("");
  const [restEmail, setRestEmail] = useState("");
  const [restHours, setRestHours] = useState("");
  const [restDescription, setRestDescription] = useState("");

  // Notification preferences (stored locally for now)
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifSummary, setNotifSummary] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Hydrate fields from DB data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (restaurant) {
      setRestName(restaurant.name ?? "");
      setRestType(restaurant.type ?? "");
      setRestAddress(restaurant.address ?? "");
      setRestPhone(restaurant.phone ?? "");
      setRestEmail(restaurant.email ?? "");
      setRestHours(restaurant.openingHours ?? "");
      setRestDescription(restaurant.description ?? "");
    }
  }, [restaurant]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await Promise.all([
        updateProfile({ firstName, lastName, phone }),
        updateRestaurant({
          name: restName,
          type: restType,
          address: restAddress,
          phone: restPhone,
          email: restEmail,
          openingHours: restHours,
          description: restDescription,
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Configure account, restaurant details, and notifications."
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1bad1a] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : saved ? (
              <CheckCircle2 size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
          </button>
        }
      />

      {saveError && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {saveError}
        </div>
      )}

      {saved && (
        <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-[#22c51f]">
          All changes saved successfully ✓
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* ── Left column ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Owner details */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Owner Details</h2>
                <p className="text-sm text-neutral-500">Your personal account information.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" value={firstName} onChange={setFirstName} placeholder="John" />
              <Field label="Last name" value={lastName} onChange={setLastName} placeholder="Park" />
              <Field label="Primary email" value={user?.email ?? ""} readOnly />
              <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+250 784 000 000" />
            </div>
          </DashboardCard>

          {/* Restaurant details */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Restaurant Details</h2>
                <p className="text-sm text-neutral-500">Business profile shown to customers.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Restaurant name" value={restName} onChange={setRestName} placeholder="e.g. Taste of Kigali" />
              <Field label="Type / Cuisine" value={restType} onChange={setRestType} placeholder="e.g. Casual Dining" />
              <div className="sm:col-span-2">
                <Field label="Address" value={restAddress} onChange={setRestAddress} placeholder="Street, City, Country" />
              </div>
              <Field label="Phone" value={restPhone} onChange={setRestPhone} type="tel" placeholder="+250 7XX XXX XXX" />
              <Field label="Email" value={restEmail} onChange={setRestEmail} type="email" placeholder="restaurant@email.com" />
              <div className="sm:col-span-2">
                <Field label="Opening hours" value={restHours} onChange={setRestHours} placeholder="e.g. 08:00 – 22:00" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  value={restDescription}
                  onChange={(e) => setRestDescription(e.target.value)}
                  placeholder="Tell customers what makes your restaurant special..."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-[#22c51f] focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </DashboardCard>

          {/* Billing */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Billing</h2>
                <p className="text-sm text-neutral-500">Subscription and payment settings.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-500">Plan</p>
                <p className="mt-1 text-sm font-bold text-neutral-900">
                  {restaurant?.plan ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-500">Billing cycle</p>
                <p className="mt-1 text-sm font-bold capitalize text-neutral-900">
                  {restaurant?.billingCycle ?? "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-500">Status</p>
                <p
                  className={`mt-1 text-sm font-bold capitalize ${
                    restaurant?.subscriptionStatus === "active"
                      ? "text-[#22c51f]"
                      : "text-amber-600"
                  }`}
                >
                  {restaurant?.subscriptionStatus ?? "—"}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Security */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Security</h2>
                <p className="text-sm text-neutral-500">Account protection settings.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Two-factor auth</p>
                  <p className="text-xs text-neutral-500">Extra layer of security</p>
                </div>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-[#22c51f]">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Session timeout</p>
                  <p className="text-xs text-neutral-500">Auto sign-out</p>
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
                  7 days
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Notifications */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Notifications</h2>
                <p className="text-sm text-neutral-500">Control what alerts you receive.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "New bookings", value: notifBookings, set: setNotifBookings },
                { label: "Order alerts", value: notifOrders, set: setNotifOrders },
                { label: "Weekly summaries", value: notifSummary, set: setNotifSummary },
              ].map(({ label, value, set: setter }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <p className="text-sm font-semibold text-neutral-900">{label}</p>
                  <button
                    type="button"
                    onClick={() => setter((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-[#22c51f]" : "bg-neutral-200"
                    }`}
                    role="switch"
                    aria-checked={value}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Integrations */}
          <DashboardCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-[#22c51f]">
                <Zap size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Integrations</h2>
                <p className="text-sm text-neutral-500">Connected apps and services.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: "Stripe", status: restaurant?.subscriptionStatus === "active" ? "Connected" : "Pending setup" },
                { name: "Cloudinary", status: "Connected" },
                { name: "Google Calendar", status: "Not connected" },
              ].map((intg) => (
                <div
                  key={intg.name}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{intg.name}</p>
                    <p className="text-xs text-neutral-500">{intg.status}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      intg.status === "Connected"
                        ? "bg-green-100 text-[#22c51f]"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {intg.status === "Connected" ? "Active" : "Setup"}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
