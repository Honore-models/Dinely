/**
 * Generate varied delivery time and fee based on restaurant id/index
 * so cards don't look hardcoded.
 */

const DELIVERY_TIMES = [
  "15 – 25 Min",
  "20 – 30 Min",
  "25 – 35 Min",
  "30 – 40 Min",
  "10 – 20 Min",
  "35 – 45 Min",
  "15 – 30 Min",
  "20 – 35 Min",
];

const DELIVERY_FEES = [
  "Free delivery",
  "Free delivery over $25",
  "$2.99 delivery",
  "Free delivery",
  "$1.50 delivery",
  "$3.99 delivery",
  "Free delivery over $20",
  "$0.99 delivery",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDeliveryInfo(restaurantId: string, index: number) {
  const hash = hashCode(restaurantId);
  return {
    deliveryTime: DELIVERY_TIMES[(hash + index) % DELIVERY_TIMES.length],
    deliveryFee: DELIVERY_FEES[(hash + index) % DELIVERY_FEES.length],
  };
}
