import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-white pt-20 pb-16">
      {/* Curved background shapes */}
      <div className="absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-[#e8f5e9] opacity-60 blur-3xl -translate-y-1/4 translate-x-1/4" />
      <div className="absolute right-40 top-20 h-[400px] w-[400px] rounded-full bg-[#f0fdf4] opacity-80 blur-2xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-4">
          {/* Left content */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#22c51f]">
              <span className="h-px w-8 bg-[#22c51f]" />
              Welcome to Dinely
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.1] text-neutral-900 md:text-5xl lg:text-[56px]">
              Discover Restaurants
              <br />& <span className="text-[#22c51f]">Taste the Best</span>
              <br />Food Near You.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-500">
              Find the finest and freshest restaurants, order food to satisfy your
              cravings, and manage your restaurant business — all in one powerful
              platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/explore" variant="animated">
                Order Now
              </Button>
              <Link
                href="/explore"
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[#22c51f] bg-transparent px-7 text-sm font-bold text-[#22c51f] transition hover:bg-green-50"
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            {/* Main food image — no background */}
            <div className="relative mx-auto h-[420px] w-[420px] md:h-[520px] md:w-[520px]">
              <Image
                src="/Order_food.png"
                alt="Delicious food"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Floating card — Owner */}
            <div className="animate-float-card-1 absolute -bottom-2 left-4 flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg md:bottom-8 md:-left-6">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#e8f5e9]">
                <Image
                  src="/man1.webp"
                  alt="Robert Fisher"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Robert Fisher</p>
                <p className="text-xs text-neutral-500">Restaurant Owner</p>
              </div>
              <div className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-[#22c51f] text-white">
                <Star size={14} className="fill-white" />
              </div>
            </div>

            {/* Floating card — Dish */}
            <div className="animate-float-card-2 absolute -bottom-2 right-4 flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white/90 backdrop-blur-sm px-4 py-3 shadow-lg md:bottom-20 md:-right-6">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                <Image
                  src="/food5.jpg"
                  alt="Classic Beef Burger"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Classic Beef Burger</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm font-extrabold text-[#22c51f]">$13.50</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
