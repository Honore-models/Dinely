import { forwardRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  icon?: ReactNode;
  size?: "default" | "compact";
  togglePassword?: boolean;
}

const inputSizes = {
  default: { label: "mb-1.5 text-sm", field: "h-12 text-sm" },
  compact: { label: "mb-1 text-xs", field: "h-10 text-sm" },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, size = "default", className = "", togglePassword = false, type, ...props }, ref) => {
    const s = inputSizes[size];
    const [visible, setVisible] = useState(false);
    const isPassword = togglePassword && type === "password";
    return (
      <label className="block">
        <span className={`block font-medium text-neutral-700 dark:text-neutral-300 ${s.label}`}>
          {label}
        </span>
        <span className="relative block">
          {icon ? (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {icon}
            </span>
          ) : null}
          <input
            ref={ref}
            type={isPassword && visible ? "text" : type}
            className={`w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 text-neutral-900 outline-none transition placeholder:text-neutral-400 autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_#ffffff] autofill:[-webkit-text-fill-color:#171717] focus:border-[#22c51f] focus:bg-white focus:ring-2 focus:ring-green-100/80 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555] dark:focus:bg-neutral-800 dark:focus:ring-green-900/50 ${s.field} ${
              icon ? "pl-10" : ""
            } ${isPassword ? "pr-10" : ""} ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:border-red-500" : ""} ${className}`}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </span>
        {error ? (
          <span className="mt-1 block text-xs text-red-500 dark:text-red-400">{error}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
