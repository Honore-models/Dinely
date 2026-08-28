"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface PromptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function PromptModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmText = "Save",
  cancelText = "Cancel",
  loading = false,
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) setValue(defaultValue);
  }, [open, defaultValue]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          {message && (
            <p className="mt-1.5 text-sm text-neutral-500">{message}</p>
          )}

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="mt-5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-[#22c51f] focus:ring-2 focus:ring-green-100"
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onConfirm(value.trim());
                onClose();
              }
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex border-t border-neutral-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <div className="w-px bg-neutral-100" />
          <button
            onClick={() => {
              if (value.trim()) {
                onConfirm(value.trim());
                onClose();
              }
            }}
            disabled={loading || !value.trim()}
            className="flex-1 px-4 py-3.5 text-sm font-semibold text-white transition bg-[#22c51f] hover:bg-[#1bad1a] disabled:opacity-60"
          >
            {loading ? "Saving..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
