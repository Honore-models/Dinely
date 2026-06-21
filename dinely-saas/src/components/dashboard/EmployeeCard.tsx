"use client";

import { Mail, Phone, Pencil, Trash2 } from "lucide-react";

interface EmployeeCardProps {
  name: string;
  role: string;
  department: string;
  hireDate: string;
  email: string;
  phone: string;
  image?: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EmployeeCard({
  name, role, department, hireDate, email, phone, image, isActive = true, onEdit, onDelete,
}: EmployeeCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-100">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-200">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-neutral-600">
                {name.charAt(0)}
              </div>
            )}
            <div
              className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${
                isActive ? "bg-emerald-500" : "bg-red-400"
              }`}
            />
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900">{name}</h4>
            <p className="text-sm text-neutral-500">{role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-[#22c51f]"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="grid h-8 w-8 place-items-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Department</p>
          <p className="text-neutral-800">{department}</p>
        </div>
        <div>
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Hire date</p>
          <p className="text-neutral-800">{hireDate}</p>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <Mail size={13} className="shrink-0 text-neutral-400" />
          <span className="truncate text-xs">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <Phone size={13} className="shrink-0 text-neutral-400" />
          <span className="text-xs">{phone}</span>
        </div>
      </div>
    </div>
  );
}
