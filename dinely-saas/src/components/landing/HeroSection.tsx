import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";


export function HeroSection() {
  return (
    <section className="relative flex h-full w-full items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-size-[88px_88px]" />
      <div className="relative mx-auto w-full max-w-7xl px-6">


        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-neutral-700 md:text-[44px]">
              Discover <span className="text-[#78d96d]">Restaurants.</span>
              <br />
              Manage Them Smarter.
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-neutral-600">
              A unified platform where customers explore restaurants and
              restaurant owners manage bookings, menus, and performance in real
              time.
            </p>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center">
                {["AM", "SK", "NP"].map((avatar, index) => (
                  <div
                    key={avatar}
                    className={`-ml-3 grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-linear-to-br from-green-100 to-orange-100 text-xs font-bold first:ml-0 ${
                      index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                    }`}
                  >
                    {avatar}
                  </div>
                ))}
                <div className="ml-4">
                  <p className="text-xl font-bold text-[#22c51f]">45K+</p>
                  <p className="text-lg font-semibold text-neutral-600">
                    Trusted Customers
                  </p>
                </div>
              </div>
              <div className="hidden h-12 w-px bg-neutral-300 md:block" />
              <div>
                <p className="text-xl font-bold text-neutral-800">4.8/5</p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={22}
                      className={
                        index < 4
                          ? "fill-green-100 text-[#22c51f]"
                          : "text-neutral-900"
                      }
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-neutral-800">
                    Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-10 flex flex-col items-start gap-5">
              <Link
                href="/home"
                className="inline-flex items-center gap-5 text-xl font-bold text-[#63c900]"
              >
                Explore Restaurants <ArrowRight />
              </Link>
              <Button href="/onboarding/step-1" className="text-black">
                Get Started as a Restaurant
              </Button>

              {/* Professional Subtle Arrow */}
              <div className="absolute -bottom-12 left-56 hidden w-20 md:block lg:-bottom-16 lg:left-64 lg:w-28">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-70"
                  style={{ animation: "floatArrow 4s ease-in-out infinite" }}
                >
                  <path
                    d="M 10 10 Q 10 80 85 85"
                    stroke="#78d96d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="120"
                    strokeDashoffset="0"
                  />
                  <path
                    d="M 70 70 L 85 85 L 70 100"
                    stroke="#78d96d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[800px] lg:max-w-none">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[#78d96d]/20 via-transparent to-orange-400/20 opacity-70 blur-2xl lg:-inset-8"></div>
            
            {/* Professional glassmorphism container */}
            <div className="relative rounded-[24px] border border-neutral-200/50 bg-white/40 p-2 shadow-2xl shadow-[#78d96d]/10 backdrop-blur-md sm:p-3 lg:p-4">
              {/* Inner frame for the image */}
              <div className="overflow-hidden rounded-[16px] border border-neutral-100/80 bg-white shadow-inner">
                <Image
                  src="/image.png"
                  alt="Dashboard Preview"
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
