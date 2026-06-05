"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface TopOrder {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface TopOrdersSectionProps {
  orders: TopOrder[];
}

export function TopOrdersSection({ orders }: TopOrdersSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-neutral-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-neutral-900">Top Orders</h3>
        <a
          href="#"
          className="flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700 transition"
        >
          View all
          <ChevronRight size={16} />
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-start gap-4 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0"
          >
            <div className="h-20 w-20 rounded-lg bg-neutral-200 flex-shrink-0 overflow-hidden">
              {order.image && (
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900">{order.name}</h4>
              <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                {order.description}
              </p>
              <p className="text-sm font-bold text-neutral-900 mt-2">
                {order.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
