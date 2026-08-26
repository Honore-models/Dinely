"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  CreditCard,
  Truck,
  Package,
  UtensilsCrossed,
  User,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";

interface OrderDetailsProps {
  orderID: string;
  date: string;
  time: string;
  status: "Completed" | "Active" | "Cancelled" | "Pending";
  customer: {
    name: string;
    phone: string;
    address: string;
    avatar?: string;
  };
  type: "Delivery" | "Takeaway" | "Dine-in";
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  subtotal: string;
  deliveryFee: string;
  total: string;
  payment: {
    method: string;
    status: string;
    transactionID: string;
  };
}

export function OrderDetails({
  orderID,
  date,
  time,
  status,
  customer,
  type,
  items,
  subtotal,
  deliveryFee,
  total,
  payment,
}: OrderDetailsProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Completed":
        return "text-emerald-600";
      case "Active":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-amber-600";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Completed":
        return <CheckCircle className={getStatusColor(s)} size={20} />;
      case "Active":
        return <Clock className={getStatusColor(s)} size={20} />;
      case "Cancelled":
        return <XCircle className={getStatusColor(s)} size={20} />;
      default:
        return <Clock className={getStatusColor(s)} size={20} />;
    }
  };

  const handleStatusChange = async (newStatus: "Active" | "Completed" | "Cancelled") => {
    setUpdating(true);
    try {
      // Extract the original order ID (remove the # prefix and get the last 6 chars)
      const id = orderID.replace("#", "").toLowerCase();
      await ordersApi.updateStatus(id, newStatus);
      router.refresh();
    } catch {
      // Status update failed silently
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-[#22c51f] font-bold text-lg hover:underline transition"
        >
          <ChevronLeft size={20} />
          Order Details
        </Link>
      </div>

      {/* Order Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          {getStatusIcon(status)}
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{orderID}</h2>
            <p className="text-xs text-neutral-500">
              {date} · {time}
            </p>
          </div>
        </div>
        <span className={`font-bold text-sm ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Customer Information */}
      <div className="mb-4 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
          <User size={18} className="text-[#22c51f]" />
          Customer Information
        </h4>
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f]/10 text-sm font-bold text-[#22c51f]">
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900 text-sm">
              {customer.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-neutral-600 mt-1">
              <Phone size={12} />
              <span>{customer.phone}</span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">{customer.address}</p>
          </div>
        </div>
      </div>

      {/* Order Type */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900">
          {type === "Delivery" && <Truck size={18} className="text-[#22c51f]" />}
          {type === "Takeaway" && <Package size={18} className="text-[#22c51f]" />}
          {type === "Dine-in" && <UtensilsCrossed size={18} className="text-[#22c51f]" />}
          Order Type
        </h4>
        <p className="text-sm font-semibold text-neutral-900">{type}</p>
      </div>

      {/* Order Items */}
      <div className="mb-4 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
          <ShoppingBag size={18} className="text-[#22c51f]" />
          Order Items
        </h4>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="font-bold text-[#22c51f]">
                  {item.quantity}×
                </span>
                <span className="text-neutral-700 ml-2">{item.name}</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {item.price}
              </span>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-2 mt-2 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold text-neutral-900">{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Delivery Fee</span>
              <span className="font-semibold text-neutral-900">
                {deliveryFee}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-neutral-900">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
          <CreditCard size={18} className="text-[#22c51f]" />
          Payment Information
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-neutral-500 font-semibold mb-1">
              Method
            </p>
            <p className="text-sm text-neutral-900">{payment.method}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold mb-1">
              Status
            </p>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-[#22c51f]" />
              <p className="text-sm font-semibold text-[#22c51f]">
                {payment.status}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold mb-1">
              Transaction ID
            </p>
            <p className="text-xs font-mono text-neutral-900">
              {payment.transactionID}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {status === "Pending" && (
          <button
            onClick={() => handleStatusChange("Active")}
            disabled={updating}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition disabled:opacity-60"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            Start Preparing
          </button>
        )}
        {status === "Active" && (
          <button
            onClick={() => handleStatusChange("Completed")}
            disabled={updating}
            className="flex items-center justify-center gap-2 bg-[#22c51f] text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-[#1bad1a] transition disabled:opacity-60"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Mark as Completed
          </button>
        )}
        {(status === "Pending" || status === "Active") && (
          <button
            onClick={() => handleStatusChange("Cancelled")}
            disabled={updating}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-lg px-4 py-2 text-sm hover:bg-red-100 transition border border-red-200 disabled:opacity-60"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
