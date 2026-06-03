"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { DinelyLogo } from "../brand/DinelyLogo";
import { Button } from "../ui/Button";
import { smoothEase } from "../../lib/motion";

export function Header() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 bg-white/70 px-6 py-4 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, y: -16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: smoothEase }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
          <DinelyLogo width={126} height={48} priority />
        </Link>
        <motion.div
          className="flex items-center gap-6"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: smoothEase }}
        >
          <Link
            href="/login"
            className="font-bold text-black transition-colors duration-300 hover:text-[#22c51f]"
          >
            Login
          </Link>
          <Button href="/register" className="text-black transition-transform duration-300 hover:scale-[1.02]">
            Sign up free
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
