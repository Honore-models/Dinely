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
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
        >
          <ChevronLeft size={20} />
          Order Details
        </Link>
        <button className="text-neutral-400 hover:text-neutral-600">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="mb-6 border-b border-neutral-200 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock size={18} className="text-neutral-400" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {orderID}
                </h3>
                <p className="text-sm text-neutral-500">
                  {date} · {time}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 font-semibold ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            {status}
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <User size={16} className="text-emerald-600" />
          Customer Information
        </h4>
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-700">
            {initials}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">{customer.name}</p>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
              <Phone size={14} />
              {customer.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
              <MapPin size={14} />
              {customer.address}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          {type === "Delivery" && (
            <Truck size={16} className="text-emerald-600" />
          )}
          {type === "Takeaway" && (
            <Package size={16} className="text-emerald-600" />
          )}
          {type === "Dine-in" && (
            <UtensilsCrossed size={16} className="text-emerald-600" />
          )}
          Order Type
        </h4>
        <p className="text-neutral-700 font-medium">{type}</p>
      </div>

      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <ShoppingBag size={16} className="text-emerald-600" />
          Order Items
        </h4>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <p className="text-neutral-700">
                <span className="font-semibold text-emerald-600">
                  {item.quantity}X
                </span>{" "}
                {item.name}
              </p>
              <p className="font-semibold text-neutral-900">{item.price}</p>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-3 mt-3">
            <div className="flex items-center justify-between text-neutral-700 mb-2">
              <p>SubTotal</p>
              <p className="font-medium">{subtotal}</p>
            </div>
            <div className="flex items-center justify-between text-neutral-700 mb-3">
              <p>Delivery Fee</p>
              <p className="font-medium">{deliveryFee}</p>
            </div>
            <div className="flex items-center justify-between font-semibold text-neutral-900 text-lg">
              <p>Total</p>
              <p>{total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <CreditCard size={16} className="text-emerald-600" />
          Payment Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Method</p>
            <p className="font-medium text-neutral-900">{payment.method}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <p className="font-medium text-neutral-900">{payment.status}</p>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-neutral-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-neutral-900">
              {payment.transactionID}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-emerald-700 transition">
          <CheckCircle size={18} />
          Mark As Ready
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-700 transition">
          <Clock size={18} />
          Start Preparing
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-red-700 transition">
          <XCircle size={18} />
          Cancel Order
        </button>
        <button className="border border-neutral-300 text-neutral-700 font-semibold rounded-lg px-4 py-3 hover:bg-neutral-50 transition">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
