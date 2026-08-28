"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

const typeConfig = {
  success: { icon: CheckCircle2, bg: "bg-green-50 border-green-200", text: "text-green-800", iconColor: "text-green-500" },
  error: { icon: XCircle, bg: "bg-red-50 border-red-200", text: "text-red-800", iconColor: "text-red-500" },
  info: { icon: Info, bg: "bg-blue-50 border-blue-200", text: "text-blue-800", iconColor: "text-blue-500" },
};

export function Toast({ open, onClose, message, type = "success", duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open && !visible) return null;

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${
          config.bg
        } ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        <Icon size={18} className={config.iconColor} />
        <p className={`text-sm font-semibold ${config.text}`}>{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 grid h-6 w-6 place-items-center rounded-full text-neutral-400 transition hover:bg-black/5 hover:text-neutral-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
