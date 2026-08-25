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
  // Uiverse skew-fill animated button
  if (variant === "animated") {
    const baseClasses = `relative z-[1] inline-flex h-12 items-center justify-center overflow-hidden rounded-[10px] bg-[#22c51f] px-8 text-sm font-bold text-white cursor-pointer transition-colors duration-300 hover:text-[#22c51f] ${className}`;

    const afterClasses = `after:absolute after:z-[-1] after:left-[-20%] after:right-[-20%] after:top-0 after:bottom-0 after:-skew-x-[45deg] after:scale-x-0 after:scale-y-[1] after:bg-white after:transition-all after:duration-500 hover:after:scale-x-[1] hover:after:scale-y-[1]`;

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
