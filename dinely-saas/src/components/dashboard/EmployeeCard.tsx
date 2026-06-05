"use client";

import React from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";

interface EmployeeCardProps {
  name: string;
  role: string;
  department: string;
  hireDate: string;
  email: string;
  phone: string;
  image?: string;
  isActive?: boolean;
}

export function EmployeeCard({
  name,
  role,
  department,
  hireDate,
  email,
  phone,
  image,
  isActive = true,
}: EmployeeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-neutral-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-neutral-300 flex-shrink-0 overflow-hidden relative">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-neutral-700">
                {name.charAt(0)}
              </div>
            )}
            {!isActive && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900">{name}</h4>
            <p className="text-sm text-neutral-600">{role}</p>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs text-neutral-500 font-semibold mb-1">
            Department
          </p>
          <p className="text-neutral-900">{department}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-semibold mb-1">
            Hire date
          </p>
          <p className="text-neutral-900">{hireDate}</p>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <Mail size={14} />
          <span className="text-xs">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <Phone size={14} />
          <span className="text-xs">{phone}</span>
        </div>
      </div>
    </div>
  );
}
