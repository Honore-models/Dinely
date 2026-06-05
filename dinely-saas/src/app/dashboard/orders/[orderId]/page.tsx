"use client";

import { OrderDetails } from "../../../../components/dashboard/OrderDetails";
import { useParams } from "next/navigation";

// Mock data - this should come from your API in production
const orders = [
  {
    id: "1",
    orderID: "#100",
    customer: {
      name: "John Lee",
      phone: "+120 9834 24411",
      address: "123 Main Street, New York, NY 001",
    },
    items: [
      { name: "Pizza", quantity: 2, price: "$85.5", category: "Garlic Bread" },
    ],
    type: "Delivery" as const,
    total: "$100",
    subtotal: "$97",
    deliveryFee: "$3",
    date: "29 may 2026",
    time: "10:30 AM",
    status: "Completed" as const,
    payment: {
      method: "Online Payment",
      status: "Paid",
      transactionID: "KN209512358324150914",
    },
  },
  {
    id: "2",
    orderID: "#101",
    customer: {
      name: "Ketty S",
      phone: "+120 9834 24411",
      address: "123 Main Street, New York, NY 001",
    },
    items: [
      {
        name: "Chicken Burger",
        quantity: 2,
        price: "$98.2",
        category: "Coke, Sprite",
      },
    ],
    type: "Takeaway" as const,
    total: "$98.2",
    subtotal: "$95.2",
    deliveryFee: "$3",
    date: "28 may 2026",
    time: "08:15 AM",
    status: "Active" as const,
    payment: {
      method: "Online Payment",
      status: "Paid",
      transactionID: "KN209512358324150914",
    },
  },
  {
    id: "3",
    orderID: "#102",
    customer: {
      name: "Peterson",
      phone: "+120 9834 24411",
      address: "123 Main Street, New York, NY 001",
    },
    items: [
      {
        name: "Veg Pasta",
        quantity: 1,
        price: "$70",
        category: "Garlic Bread",
      },
    ],
    type: "Dine-in" as const,
    total: "$70",
    subtotal: "$67",
    deliveryFee: "$3",
    date: "24 mar 2026",
    time: "13:20 PM",
    status: "Completed" as const,
    payment: {
      method: "Online Payment",
      status: "Paid",
      transactionID: "KN209512358324150914",
    },
  },
  {
    id: "4",
    orderID: "#103",
    customer: {
      name: "Ming joe",
      phone: "+120 9834 24411",
      address: "123 Main Street, New York, NY 001",
    },
    items: [
      {
        name: "Grilled Chicken",
        quantity: 3,
        price: "$120",
        category: "French Fries, Ice Juice",
      },
    ],
    type: "Delivery" as const,
    total: "$120",
    subtotal: "$117",
    deliveryFee: "$3",
    date: "12 may 2026",
    time: "10:45 AM",
    status: "Cancelled" as const,
    payment: {
      method: "Online Payment",
      status: "Paid",
      transactionID: "KN209512358324150914",
    },
  },
  {
    id: "5",
    orderID: "#104",
    customer: {
      name: "Ashraf.K",
      phone: "+120 9834 24411",
      address: "123 Main Street, New York, NY 001",
    },
    items: [
      {
        name: "Veg Burger",
        quantity: 2,
        price: "$45.1",
        category: "Garlic Bread",
      },
    ],
    type: "Takeaway" as const,
    total: "$45.1",
    subtotal: "$42.1",
    deliveryFee: "$3",
    date: "24 may 2026",
    time: "09:50 PM",
    status: "Active" as const,
    payment: {
      method: "Online Payment",
      status: "Paid",
      transactionID: "KN209512358324150914",
    },
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  // Find the order by ID
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <OrderDetails
      orderID={order.orderID}
      date={order.date}
      time={order.time}
      status={order.status}
      customer={order.customer}
      type={order.type}
      items={order.items}
      subtotal={order.subtotal}
      deliveryFee={order.deliveryFee}
      total={order.total}
      payment={order.payment}
    />
  );
}
