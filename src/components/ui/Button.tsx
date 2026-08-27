import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-[#22c51f] text-white hover:bg-[#1bad1a] border-[#22c51f] dark:bg-[#22c555] dark:hover:bg-[#1aad1a]",
  outline: "bg-white text-[#22c51f] hover:bg-green-50 border-[#22c51f] dark:bg-neutral-900 dark:text-green-400 dark:hover:bg-green-950 dark:border-green-700",
  ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100 border-transparent dark:text-neutral-200 dark:hover:bg-neutral-800",
  dark: "bg-neutral-950 text-white hover:bg-neutral-800 border-neutral-950 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:border-white",
  animated: "",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props
}: ButtonProps) {
  if (variant === "animated") {
    const baseClasses = `relative z-[1] inline-flex h-12 items-center justify-center overflow-hidden rounded-[10px] bg-[#22c51f] px-8 text-sm font-bold text-white cursor-pointer transition-colors duration-300 hover:text-[#22c51f] dark:bg-[#22c555] dark:hover:text-[#22c555] ${className}`;

    const afterClasses = `after:absolute after:z-[-1] after:left-[-20%] after:right-[-20%] after:top-0 after:bottom-0 after:-skew-x-[45deg] after:scale-x-0 after:scale-y-[1] after:bg-white dark:after:bg-neutral-900 after:transition-all after:duration-500 hover:after:scale-x-[1] hover:after:scale-y-[1]`;

    const inner = <span className="relative z-[2]">{children}</span>;

    if (href) {
      return (
        <Link href={href} className={`${baseClasses} ${afterClasses}`}>
          {inner}
        </Link>
      );
    }

    return (
      <button className={`${baseClasses} ${afterClasses}`} {...props}>
        {inner}
      </button>
    );
  }

  const classes = `inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition ${sizeClasses[size]} ${variants[variant]} ${className}`;

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
