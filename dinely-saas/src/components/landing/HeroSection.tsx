import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";

function DashboardPreview() {
  const tables = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="relative min-h-105 lg:min-h-152.5">
      <div className="absolute right-0 top-3 w-130 max-w-[92vw] rounded-lg border-2 border-[#22c51f] bg-white shadow-xl">
        <div className="flex">
          <aside className="w-28 border-r border-neutral-100 p-3">
            <p className="text-lg font-bold text-[#22c51f]">Table</p>
            {[
              "Dashboard",
              "Bookings",
              "Menu",
              "Clients",
              "Orders",
              "Settings",
            ].map((item, index) => (
              <div
                key={item}
                className={`mt-3 rounded px-2 py-1 text-[10px] font-semibold ${
                  index === 1
                    ? "bg-green-100 text-[#22c51f]"
                    : "text-neutral-500"
                }`}
              >
                {item}
              </div>
            ))}
          </aside>
          <div className="flex-1 p-5">
            <h3 className="text-lg font-bold">Restaurant map</h3>
            <div className="mt-4 grid grid-cols-4 gap-3 rounded-md border border-neutral-100 bg-neutral-50 p-4">
              {tables.map((table) => (
                <div
                  key={table}
                  className={`h-14 rounded border p-2 text-center text-[10px] font-bold ${
                    table % 3 === 0
                      ? "border-orange-200 bg-orange-50 text-orange-500"
                      : table % 3 === 1
                        ? "border-blue-200 bg-blue-50 text-blue-500"
                        : "border-green-200 bg-green-50 text-[#22c51f]"
                  }`}
                >
                  <span className="block">B-{table + 1}</span>
                  <span className="font-medium">
                    {table % 3 === 2 ? "Free" : "Booked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-8 w-140 max-w-[94vw] rounded-lg border border-green-200 bg-white p-5 shadow-2xl shadow-green-200">
        <div className="grid grid-cols-3 gap-4 text-xs">
          {["Starter Plan", "Professional Plan", "Enterprise Plan"].map(
            (plan, index) => (
              <div
                key={plan}
                className={`rounded-lg border p-4 ${index === 1 ? "border-[#22c51f] shadow-md" : "border-green-100"}`}
              >
                <p className="font-bold text-[#22c51f]">{plan}</p>
                <p className="mt-2 text-lg font-bold text-orange-400">
                  ${index === 0 ? 9 : index === 1 ? 14 : 20}
                </p>
                <div className="mt-4 h-2 rounded bg-green-100" />
                <div className="mt-2 h-2 w-2/3 rounded bg-green-100" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[88px_88px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Dinely"
              width={126}
              height={48}
              priority
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="font-bold text-black">
              Login
            </Link>
            <Button href="/register" className="text-black">
              Sign up free
            </Button>
          </div>
        </nav>

        <div className="grid items-center gap-12 pt-24 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-neutral-700 md:text-5xl">
              Discover <span className="text-[#78d96d]">Restaurants.</span>
              <br />
              Manage Them Smarter.
            </h1>
            <p className="mt-9 max-w-3xl text-xl font-semibold leading-relaxed text-neutral-600">
              A unified platform where customers explore restaurants and
              restaurant owners manage bookings, menus, and performance in real
              time.
            </p>

            <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex items-center">
                {["AM", "SK", "NP"].map((avatar, index) => (
                  <div
                    key={avatar}
                    className={`-ml-3 grid h-14 w-14 place-items-center rounded-full border-2 border-white bg-linear-to-br from-green-100 to-orange-100 text-sm font-bold first:ml-0 ${
                      index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                    }`}
                  >
                    {avatar}
                  </div>
                ))}
                <div className="ml-4">
                  <p className="text-2xl font-bold text-[#22c51f]">45K+</p>
                  <p className="text-xl font-semibold text-neutral-600">
                    Trusted Customers
                  </p>
                </div>
              </div>
              <div className="hidden h-12 w-px bg-neutral-300 md:block" />
              <div>
                <p className="text-2xl font-bold text-neutral-800">4.8/5</p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={24}
                      className={
                        index < 4
                          ? "fill-green-100 text-[#22c51f]"
                          : "text-neutral-900"
                      }
                    />
                  ))}
                  <span className="ml-2 text-xl font-bold text-neutral-800">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-start gap-6">
              <Link
                href="/home"
                className="inline-flex items-center gap-6 text-2xl font-bold text-[#63c900]"
              >
                Explore Restaurants <ArrowRight />
              </Link>
              <Button href="/onboarding/step-1" className="text-black">
                Get Started as a Restaurant
              </Button>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
