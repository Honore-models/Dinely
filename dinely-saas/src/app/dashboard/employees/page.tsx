"use client";

import { useState } from "react";
import { DashboardPageHeader } from "../../../components/dashboard/DashboardPageHeader";
import { EmployeeCard } from "../../../components/dashboard/EmployeeCard";
import { Download, Plus } from "lucide-react";

export default function EmployeesPage() {
  const [employees] = useState([
    {
      id: "1",
      name: "Robert Fisher",
      role: "CEO",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
    },
    {
      id: "2",
      name: "Jason Miller",
      role: "Manager",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "jason@gmail.com",
      phone: "+120 9834 24411",
      isActive: false,
    },
    {
      id: "3",
      name: "Robert Fisher",
      role: "CEO",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
    },
    {
      id: "4",
      name: "Robert Fisher",
      role: "CEO",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
    },
    {
      id: "5",
      name: "Bessie Cooper",
      role: "CEO",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: false,
    },
    {
      id: "6",
      name: "Robert Fisher",
      role: "CEO",
      department: "Sales",
      hireDate: "09/7/2026",
      email: "robert@gmail.com",
      phone: "+120 9834 24411",
      isActive: true,
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
