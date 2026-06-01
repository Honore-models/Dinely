import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[#22c51f] text-white hover:bg-[#1bad1a] border-[#22c51f]",
  outline: "bg-white text-[#22c51f] hover:bg-green-50 border-[#22c51f]",
  ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100 border-transparent",
  dark: "bg-neutral-950 text-white hover:bg-neutral-800 border-neutral-950",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  href?: string;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex h-11 items-center justify-center gap-2 rounded-md border px-6 text-base font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
