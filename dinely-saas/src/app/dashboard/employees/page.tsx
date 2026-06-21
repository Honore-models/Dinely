"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { EmployeeCard } from "@/components/dashboard/EmployeeCard";
import { Download, Loader2, Plus, X } from "lucide-react";
import { employeesApi } from "@/lib/api";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  salary?: number;
  startDate?: string;
  notes?: string;
}

const EMPTY_FORM = { firstName: "", lastName: "", email: "", phone: "", role: "", salary: "", startDate: "", notes: "" };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await employeesApi.list();
      setEmployees(res.data as unknown as Employee[]);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(null); setShowModal(true); };
  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      firstName: emp.firstName, lastName: emp.lastName, email: emp.email, phone: emp.phone,
      role: emp.role, salary: emp.salary?.toString() ?? "", startDate: emp.startDate ?? "", notes: emp.notes ?? "",
    });
    setError(null);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
      role: form.role, salary: form.salary ? parseFloat(form.salary) : undefined,
      startDate: form.startDate || undefined, notes: form.notes || undefined,
    };
    try {
      if (editing) {
        await employeesApi.update(editing._id, payload as Record<string, unknown>);
      } else {
        await employeesApi.create(payload);
      }
      await load();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this employee?")) return;
    try {
      await employeesApi.delete(id);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch { /* ignore */ }
  };

  return (
    <>
      <DashboardPageHeader
        title="Employees"
        description="Manage staff roles, schedules, and information."
        action={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50">
              <Download size={15} /> Export
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-lg bg-[#22c51f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1bad1a]"
            >
              <Plus size={15} /> Add Employee
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-neutral-500">No employees yet</p>
          <button onClick={openAdd} className="mt-4 rounded-full bg-[#22c51f] px-6 py-2 text-sm font-bold text-white hover:bg-[#1bad1a]">
            Add your first employee
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              name={`${emp.firstName} ${emp.lastName}`}
              role={emp.role}
              department={emp.role}
              hireDate={emp.startDate ?? "—"}
              email={emp.email}
              phone={emp.phone}
              isActive
              onEdit={() => openEdit(emp)}
              onDelete={() => handleDelete(emp._id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Edit Employee" : "Add Employee"}
              </h2>
              <button onClick={closeModal} className="rounded-full p-1 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              {error && (
                <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "First Name", field: "firstName", placeholder: "Jean", required: true },
                  { label: "Last Name", field: "lastName", placeholder: "Mutabazi", required: true },
                  { label: "Email", field: "email", placeholder: "jean@restaurant.com", required: true },
                  { label: "Phone", field: "phone", placeholder: "+250 788 000 001", required: true },
                  { label: "Role / Job Title", field: "role", placeholder: "Head Chef", required: true },
                  { label: "Monthly Salary ($)", field: "salary", placeholder: "800" },
                  { label: "Start Date", field: "startDate", placeholder: "2024-01-15" },
                ].map(({ label, field, placeholder, required }) => (
                  <label key={field} className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">{label}</span>
                    <input
                      value={(form as Record<string, string>)[field]}
                      onChange={set(field)}
                      placeholder={placeholder}
                      required={required}
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </label>
                ))}
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600">Notes</span>
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={2}
                      placeholder="Optional notes about this employee…"
                      className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editing ? "Save changes" : "Add employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
