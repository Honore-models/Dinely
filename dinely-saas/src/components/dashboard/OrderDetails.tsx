"use client";

import React from "react";
import {
  ChevronLeft,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  CreditCard,
  Truck,
  Package,
  UtensilsCrossed,
  User,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

interface OrderDetailsProps {
  orderID: string;
  date: string;
  time: string;
  status: "Completed" | "Active" | "Cancelled";
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
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Completed":
        return "text-emerald-600";
      case "Active":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-neutral-600";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Completed":
        return <CheckCircle className={`${getStatusColor(s)}`} size={20} />;
      case "Active":
        return <Clock className={`${getStatusColor(s)}`} size={20} />;
      case "Cancelled":
        return <XCircle className={`${getStatusColor(s)}`} size={20} />;
      default:
        return null;
    }
  };

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-emerald-600 font-bold text-lg hover:text-emerald-700 transition"
        >
          <ChevronLeft size={20} />
          Order Details
        </Link>
      </div>

      {/* Order Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-emerald-600" />
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
          <User size={18} className="text-emerald-600" />
          Customer Information
        </h4>
        <div className="flex gap-3">
          <img
            src={
              customer.avatar || `https://i.pravatar.cc/48?u=${customer.name}`
            }
            alt={customer.name}
            className="h-10 w-10 rounded-full"
          />
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
          {type === "Delivery" && (
            <Truck size={18} className="text-emerald-600" />
          )}
          {type === "Takeaway" && (
            <Package size={18} className="text-emerald-600" />
          )}
          {type === "Dine-in" && (
            <UtensilsCrossed size={18} className="text-emerald-600" />
          )}
          Order Type
        </h4>
        <p className="text-sm font-semibold text-neutral-900">{type}</p>
      </div>

      {/* Order Items */}
      <div className="mb-4 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
          <ShoppingBag size={18} className="text-emerald-600" />
          Order Items
        </h4>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="font-bold text-emerald-600">
                  {item.quantity}X
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
              <span className="text-neutral-600">SubTotal</span>
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
      <div className="mb-4 pb-4 border-b border-neutral-200">
        <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
          <CreditCard size={18} className="text-emerald-600" />
          Payment information
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
              <CheckCircle size={14} className="text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-600">
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
      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-emerald-700 transition">
          <CheckCircle size={16} />
          Mark As Ready
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition">
          <Clock size={16} />
          Start Preparing
        </button>
        <button className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-lg px-4 py-2 text-sm hover:bg-red-100 transition border border-red-200">
          <XCircle size={16} />
          Cancel Order
        </button>
        <button className="flex items-center justify-center gap-1 border border-neutral-300 text-neutral-700 font-semibold rounded-lg px-4 py-2 text-sm hover:bg-neutral-50 transition">
          <span>More Actions</span>
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
