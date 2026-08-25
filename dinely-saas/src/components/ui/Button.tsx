import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[#22c51f] text-white hover:bg-[#1bad1a] border-[#22c51f]",
  outline: "bg-white text-[#22c51f] hover:bg-green-50 border-[#22c51f]",
  ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100 border-transparent",
  dark: "bg-neutral-950 text-white hover:bg-neutral-800 border-neutral-950",
  animated: "",
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
  // Animated button with corner triangles
  if (variant === "animated") {
    const animClasses = `relative inline-flex items-center overflow-hidden rounded-md px-7 py-3 text-base font-bold transition-all duration-300 group ${className}`;

    const inner = (
      <>
        {/* Top-right corner triangle */}
        <span className="absolute right-0 top-0 inline-block h-4 w-4 rounded bg-[#1bad1a] transition-all duration-500 ease-in-out group-hover:-mr-4 group-hover:-mt-4">
          <span className="absolute right-0 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
        </span>
        {/* Bottom-left corner triangle */}
        <span className="absolute bottom-0 left-0 inline-block h-4 w-4 rotate-180 rounded bg-[#1bad1a] transition-all duration-500 ease-in-out group-hover:-ml-4 group-hover:-mb-4">
          <span className="absolute right-0 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
        </span>
        {/* Slide-in background */}
        <span className="absolute bottom-0 left-0 h-full w-full -translate-x-full rounded-md bg-[#1bad1a] transition-all duration-500 delay-200 ease-in-out group-hover:translate-x-0" />
        {/* Label */}
        <span className="relative z-10 text-left text-white transition-colors duration-200 ease-in-out">
          {children}
        </span>
      </>
    );

    if (href) {
      return (
        <Link href={href} className={animClasses}>
          {inner}
        </Link>
      );
    }

    return (
      <button className={animClasses} {...props}>
        {inner}
      </button>
    );
  }

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
