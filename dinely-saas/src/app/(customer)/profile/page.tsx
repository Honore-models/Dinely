"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  Lock,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", href: "/orders" },
  { icon: Heart, label: "Favourites", href: "/favourites" },
  { icon: MapPin, label: "Delivery Addresses", href: "#" },
  { icon: CreditCard, label: "Payment Methods", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Lock, label: "Security & Privacy", href: "#" },
];

export default function ProfilePage() {
  const { user, updateProfile, logout, loading, error } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const initials = `${firstName[0] ?? "U"}${lastName[0] ?? ""}`.toUpperCase();

  const handleSave = async () => {
    try {
      await updateProfile({ firstName, lastName, phone });
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // error handled by useAuth
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-extrabold text-neutral-900">My Profile</h1>

      {/* Avatar + name */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#22c51f] text-xl font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-neutral-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-neutral-500">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className="shrink-0 rounded-full border border-[#22c51f] px-4 py-1.5 text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Save success */}
      {saveSuccess && (
        <div className="mt-3 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#22c51f]">
          Profile updated successfully ✓
        </div>
      )}

      {/* Edit form */}
      {editMode && (
        <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-neutral-700">Edit Profile</h2>
          {error && (
            <p className="mb-3 text-sm text-red-500">{error}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">First Name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">Last Name</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
            <label className="col-span-full block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#22c51f] py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Menu items */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        {menuItems.map(({ icon: Icon, label, href }, idx) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-4 px-5 py-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 ${
              idx !== 0 ? "border-t border-neutral-100" : ""
            }`}
          >
            <Icon size={18} className="shrink-0 text-neutral-400" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={16} className="text-neutral-300" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-5 py-4 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
      >
        <LogOut size={18} className="shrink-0" />
        Log out
      </button>
    </div>
  );
}
