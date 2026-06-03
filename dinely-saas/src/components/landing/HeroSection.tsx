"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../ui/Button";
import {
  fadeUp,
  scaleIn,
  slideInRight,
  smoothEase,
  staggerContainer,
} from "../../lib/motion";

const avatars = ["AM", "SK", "NP"];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-white pt-24 pb-16">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-size-[88px_88px]"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              className="max-w-xl text-4xl font-bold leading-tight text-neutral-700 md:text-[44px]"
            >
              Discover <span className="text-[#78d96d]">Restaurants.</span>
              <br />
              Manage Them Smarter.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-neutral-600"
            >
              A unified platform where customers explore restaurants and restaurant owners manage
              bookings, menus, and performance in real time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-6 md:flex-row md:items-center"
            >
              <div className="flex items-center">
                {avatars.map((avatar, index) => (
                  <motion.div
                    key={avatar}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.6, x: -12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.45 + index * 0.08,
                      ease: smoothEase,
                    }}
                    className={`-ml-3 grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-linear-to-br from-green-100 to-orange-100 text-xs font-bold first:ml-0 ${
                      index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                    }`}
                  >
                    {avatar}
                  </motion.div>
                ))}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.7, ease: smoothEase }}
                  className="ml-4"
                >
                  <p className="text-xl font-bold text-[#22c51f]">45K+</p>
                  <p className="text-lg font-semibold text-neutral-600">Trusted Customers</p>
                </motion.div>
              </div>

              <div className="hidden h-12 w-px bg-neutral-300 md:block" />

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55, ease: smoothEase }}
              >
                <p className="text-xl font-bold text-neutral-800">4.8/5</p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <motion.div
                      key={index}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.6 + index * 0.06,
                        ease: smoothEase,
                      }}
                    >
                      <Star
                        size={22}
                        className={
                          index < 4 ? "fill-green-100 text-[#22c51f]" : "text-neutral-900"
                        }
                      />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-lg font-bold text-neutral-800">Rating</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative mt-10 flex flex-col items-start gap-5"
            >
              <Link
                href="/home"
                className="group inline-flex items-center gap-3 text-xl font-bold text-[#63c900] transition-colors duration-300 hover:text-[#4fa800]"
              >
                <span>Explore Restaurants</span>
                <ArrowRight
                  size={24}
                  className={reduceMotion ? "" : "animate-[floatArrow_2.8s_ease-in-out_infinite]"}
                />
              </Link>
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button href="/onboarding/step-1" className="text-black">
                  Get Started as a Restaurant
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="relative mx-auto w-full max-w-[800px] lg:max-w-none"
          >
            <motion.div
              className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[#78d96d]/25 via-transparent to-orange-400/20 opacity-80 blur-2xl lg:-inset-8"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.5, 0.85, 0.5],
                      scale: [1, 1.03, 1],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.25 }}
              className="relative"
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }
                className="rounded-[24px] border border-neutral-200/50 bg-white/40 p-2 shadow-2xl shadow-[#78d96d]/10 backdrop-blur-md sm:p-3 lg:p-4"
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
