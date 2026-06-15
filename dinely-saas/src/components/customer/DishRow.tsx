"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface DishRowProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
}

export function DishRow({
  id,
  name,
  description,
  price,
  image,
  restaurantId,
  restaurantName,
}: DishRowProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const cartItem = items.find((i) => i.menuItemId === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ menuItemId: id, name, price, quantity: 1, image, restaurantId, restaurantName });
  };

  const handleIncrease = () => updateQuantity(id, quantity + 1);
  const handleDecrease = () => updateQuantity(id, quantity - 1);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-bold text-neutral-900">{name}</h4>
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{description}</p>
        )}
        <p className="mt-1 text-sm font-bold text-[#22c51f]">${price.toFixed(2)}</p>
      </div>

      {/* Quantity control */}
      <div className="shrink-0">
        {quantity === 0 ? (
          <button
            type="button"
            onClick={handleAdd}
            className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#22c51f] text-[#22c51f] transition hover:bg-green-50"
            aria-label={`Add ${name} to cart`}
          >
            <Plus size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrease}
              className="grid h-7 w-7 place-items-center rounded-full border border-red-300 text-red-400 transition hover:bg-red-50"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm font-bold text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="grid h-7 w-7 place-items-center rounded-full border border-green-300 text-[#22c51f] transition hover:bg-green-50"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
