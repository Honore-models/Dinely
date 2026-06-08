"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { EmployeeCard } from "@/components/dashboard/EmployeeCard";
import { Download, Plus } from "lucide-react";

export default function EmployeesPage() {
  const [employees] = useState([
    {
      id: "1",
      name: "Robert Fisher",
      role: "CEO",
      department: "Management",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "2",
      name: "Jason Miller",
      role: "Manager",
      department: "Operations",
      hireDate: "09/7/2026",
      email: "jason@gmail.com",
      phone: "+120 9834 24411",
      isActive: false,
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "3",
      name: "Amina Khan",
      role: "Finance Lead",
      department: "Finance",
      hireDate: "09/7/2026",
      email: "amina@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "4",
      name: "Ethan Brown",
      role: "Operations",
      department: "Operations",
      hireDate: "09/7/2026",
      email: "ethan@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "5",
      name: "Bessie Cooper",
      role: "HR Director",
      department: "Human Resources",
      hireDate: "09/7/2026",
      email: "bessie@gmail.com",
      phone: "+120 9834 24411",
      isActive: false,
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
    },
    {
      id: "6",
      name: "Liam Chen",
      role: "Customer Success",
      department: "Customer Success",
      hireDate: "09/7/2026",
      email: "liam@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
    },
  ]);

  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = employees.filter((e) => !e.isActive).length;

  return (
    <>
      <DashboardPageHeader
        title="Manage Employees"
        description="Manage staff roles, schedules, and permissions."
      />

      {/* Stats and Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-600"></div>
            <span className="text-sm font-semibold text-neutral-900">
              Active <span className="text-emerald-600">{activeCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <span className="text-sm font-semibold text-neutral-900">
              Inactive <span className="text-red-600">{inactiveCount}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg px-4 py-2 hover:bg-neutral-50 transition">
            <Download size={16} />
            Import
          </button>
          <button className="flex items-center gap-2 border border-neutral-300 text-neutral-700 font-semibold rounded-lg px-4 py-2 hover:bg-neutral-50 transition">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-emerald-700 transition">
            <Plus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} {...employee} />
        ))}
      </div>
    </>
  );
}
