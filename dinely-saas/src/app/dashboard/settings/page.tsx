import { DashboardCard } from "../../../components/dashboard/DashboardCard";
import { DashboardPageHeader } from "../../../components/dashboard/DashboardPageHeader";
import { ShieldCheck, Bell, CreditCard, Zap, ArrowRight } from "lucide-react";

const integrations = [
  { name: "Google Calendar", status: "Connected" },
  { name: "Stripe", status: "Pending setup" },
  { name: "Slack", status: "Connected" },
];

export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Configure account, security, notifications, and integrations for your restaurant dashboard."
      />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <DashboardCard className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-[0.3em]">
                Settings center
              </p>
              <h1 className="mt-2 text-2xl font-bold text-neutral-900">
                Account settings
              </h1>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Save changes
            </button>
          </div>

          <div className="grid gap-6">
            <section className="rounded-3xl border border-neutral-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Account details
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Business information, contact details, and login settings.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Restaurant name
                  </label>
                  <p className="mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900">
                    Fork & Knife
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Primary email
                  </label>
                  <p className="mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900">
                    contact@forkandknife.com
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Phone
                  </label>
                  <p className="mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900">
                    +120 9834 24411
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Business address
                  </label>
                  <p className="mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900">
                    48 Main Street, New York, NY
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Billing preferences
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage subscription, invoices, and payment methods.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-neutral-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">
                    Billing plan
                  </p>
                  <p className="text-sm text-neutral-500">Professional</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">
                    Payment method
                  </p>
                  <p className="text-sm text-neutral-500">
                    Visa ending in 2451
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">
                    Billing cycle
                  </p>
                  <p className="text-sm text-neutral-500">Monthly renewals</p>
                </div>
              </div>
            </section>
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Security settings
                </h2>
                <p className="text-sm text-neutral-500">
                  Protect your account with strong controls.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-neutral-900">
                    Two-factor authentication
                  </p>
                  <p className="text-sm text-neutral-500">
                    Extra layer of account security.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-neutral-900">
                    Login sessions
                  </p>
                  <p className="text-sm text-neutral-500">
                    Auto sign-out after 30 minutes of inactivity.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                  30 min
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Notifications
                </h2>
                <p className="text-sm text-neutral-500">
                  Control alerts for orders, bookings, and updates.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "New bookings", enabled: true },
                { label: "Order alerts", enabled: true },
                { label: "Weekly summaries", enabled: false },
              ].map((notification) => (
                <div
                  key={notification.label}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {notification.label}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {notification.enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      notification.enabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {notification.enabled ? "On" : "Off"}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Zap size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Integrations
                </h2>
                <p className="text-sm text-neutral-500">
                  Connected apps and services for your restaurant.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {integration.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {integration.status}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50">
                    Manage
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
