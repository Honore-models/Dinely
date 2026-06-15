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
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "Robert");
  const [lastName, setLastName] = useState(user?.lastName ?? "Fisher");
  const [email, setEmail] = useState(user?.email ?? "robert.fisher@example.com");
  const [phone, setPhone] = useState(user?.phone ?? "+250 245 253 342");

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

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
            {firstName} {lastName}
          </p>
          <p className="text-sm text-neutral-500">{email}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className="shrink-0 rounded-full border border-[#22c51f] px-4 py-1.5 text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Edit form */}
      {editMode && (
        <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-neutral-700">Edit Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">
                First Name
              </span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">
                Last Name
              </span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-neutral-500">
                Phone
              </span>
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
            onClick={() => setEditMode(false)}
            className="mt-4 w-full rounded-xl bg-[#22c51f] py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a]"
          >
            Save Changes
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
