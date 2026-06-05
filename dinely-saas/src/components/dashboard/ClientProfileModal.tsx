import React from "react";
import { Mail, Tag, Phone, MoreHorizontal, X } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  status: "active" | "new" | "inactive";
}

export default function ClientProfileModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-[520px] rounded-2xl bg-white p-8 text-center shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-neutral-900">
          Client Profile
        </h3>

        <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full bg-neutral-100 flex items-center justify-center text-2xl font-semibold text-neutral-700">
          {client.name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="mb-4 text-lg font-semibold text-neutral-900">
          {client.name}
        </div>

        <div className="mb-6 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Mail size={20} />
            </div>
            <div className="text-xs text-neutral-600">Email</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
              <Tag size={20} />
            </div>
            <div className="text-xs text-neutral-600">Tags</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Phone size={20} />
            </div>
            <div className="text-xs text-neutral-600">Phone</div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-center text-sm text-neutral-600">
          More information ▾
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white">
            Call
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-200 p-2 text-neutral-600 hover:text-neutral-900"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
