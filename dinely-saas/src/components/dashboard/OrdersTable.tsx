"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Truck,
  Package,
  UtensilsCrossed,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  category: string;
}

interface Order {
  id: string;
  orderID: string;
  customer: string;
  items: OrderItem[];
  type: "Delivery" | "Takeaway" | "Dine-in";
  total: string;
  time: string;
  status: "Completed" | "Active" | "Cancelled";
}

const orders: Order[] = [
  {
    id: "1",
    orderID: "#100",
    customer: "John Lee",
    items: [{ name: "Pizza", quantity: 2, category: "Garlic Bread" }],
    type: "Delivery",
    total: "$100",
    time: "10:30 AM\n29 may 2026",
    status: "Completed",
  },
  {
    id: "2",
    orderID: "#101",
    customer: "Ketty S",
    items: [{ name: "Chicken Burger", quantity: 2, category: "Coke, Sprite" }],
    type: "Takeaway",
    total: "$98.2",
    time: "08:15 AM\n28 may 2026",
    status: "Active",
  },
  {
    id: "3",
    orderID: "#102",
    customer: "Peterson",
    items: [{ name: "Veg Pasta", quantity: 1, category: "Garlic Bread" }],
    type: "Dine-in",
    total: "$70",
    time: "13:20 PM\n24 mar 2026",
    status: "Completed",
  },
  {
    id: "4",
    orderID: "#103",
    customer: "Ming joe",
    items: [
      {
        name: "Grilled Chicken",
        quantity: 3,
        category: "French Fries, Ice Juice",
      },
    ],
    type: "Delivery",
    total: "$120",
    time: "10:45 AM\n12 may 2026",
    status: "Cancelled",
  },
  {
    id: "5",
    orderID: "#104",
    customer: "Ashraf.K",
    items: [{ name: "Veg Burger", quantity: 2, category: "Garlic Bread" }],
    type: "Takeaway",
    total: "$45.1",
    time: "09:50 PM\n24 may 2026",
    status: "Active",
  },
];

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
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

const getStatusBgColor = (status: Order["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50";
    case "Active":
      return "bg-blue-50";
    case "Cancelled":
      return "bg-red-50";
    default:
      return "bg-neutral-50";
  }
};

export function OrdersTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderID.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-100">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Order ID, name ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <button className="ml-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white flex items-center gap-2 hover:bg-neutral-800">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200">
              <tr className="text-xs font-semibold text-neutral-600">
                <th className="py-4 px-4 text-left">OrderID</th>
                <th className="py-4 px-4 text-left">Customer</th>
                <th className="py-4 px-4 text-left">Items</th>
                <th className="py-4 px-4 text-left">Type</th>
                <th className="py-4 px-4 text-left">Total</th>
                <th className="py-4 px-4 text-left">Time</th>
                <th className="py-4 px-4 text-left">Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-semibold text-neutral-900">
                    {order.orderID}
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-700">
                    {order.customer}
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-700">
                    <div className="flex flex-col">
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          <span className="font-semibold text-neutral-900">
                            {item.quantity}X {item.name}
                          </span>
                          <span className="text-neutral-500 block text-xs">
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center gap-2">
                      {order.type === "Delivery" && (
                        <Truck size={18} className="text-neutral-600" />
                      )}
                      {order.type === "Takeaway" && (
                        <Package size={18} className="text-neutral-600" />
                      )}
                      {order.type === "Dine-in" && (
                        <UtensilsCrossed
                          size={18}
                          className="text-neutral-600"
                        />
                      )}
                      <span className="text-neutral-700">{order.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-neutral-900">
                    {order.total}
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-600 whitespace-pre-line">
                    {order.time}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block text-sm font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="text-neutral-400 hover:text-neutral-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-neutral-600">9 out of 75</div>
          <div className="flex items-center gap-2">
            <button className="h-7 w-7 rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
              ◀
            </button>
            <button className="h-7 w-7 rounded bg-emerald-600 text-sm text-white font-semibold">
              1
            </button>
            <button className="h-7 w-7 rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
              2
            </button>
            <button className="h-7 w-7 rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
              3
            </button>
            <button className="h-7 w-7 rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
              ...
            </button>
            <button className="h-7 w-7 rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-50">
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrdersTable;
