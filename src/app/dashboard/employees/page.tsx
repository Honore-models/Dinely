"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { EmployeeCard } from "@/components/dashboard/EmployeeCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Download, Loader2, Plus, Search, Upload, X } from "lucide-react";
import { employeesApi, uploadApi } from "@/lib/api";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  salary?: number;
  startDate?: string;
  notes?: string;
  image?: string;
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  salary: "",
  startDate: "",
  notes: "",
  image: "",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await employeesApi.list();
      // Map snake_case Supabase columns to camelCase
      const mapped = (res.data as unknown as Record<string, unknown>[]).map((row) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        salary: row.salary,
        startDate: row.start_date,
        notes: row.notes,
        image: row.image,
      }));
      setEmployees(mapped as Employee[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };
  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      salary: emp.salary?.toString() ?? "",
      startDate: emp.startDate ?? "",
      notes: emp.notes ?? "",
      image: emp.image ?? "",
    });
    setError(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file, "dinely/employees");
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      // Upload failed silently
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      salary: form.salary ? parseFloat(form.salary) : undefined,
      startDate: form.startDate || undefined,
      notes: form.notes || undefined,
      image: form.image || undefined,
    };
    try {
      if (editing) {
        await employeesApi.update(
          editing.id,
          payload as Record<string, unknown>,
        );
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

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employeesApi.delete(deleteTarget);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget));
    } catch {
      /* ignore */
    }
    setDeleteTarget(null);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q),
    );
  }, [employees, search]);

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

      {/* Search */}
      {!loading && employees.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-[#22c51f] focus:outline-none focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[#22c555]"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (              <div
              key={i}
              className="h-52 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
            No employees yet
          </p>
          <button
            onClick={openAdd}
            className="mt-4 rounded-full bg-[#22c51f] px-6 py-2 text-sm font-bold text-white hover:bg-[#1bad1a]"
          >
            Add your first employee
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400">
            No employees match your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((emp) => (              <EmployeeCard
              key={emp.id}
              name={`${emp.firstName} ${emp.lastName}`}
              role={emp.role}
              department={emp.role}
              hireDate={emp.startDate ?? "-"}
              email={emp.email}
              phone={emp.phone}
              image={emp.image}
              isActive
              onEdit={() => openEdit(emp)}
              onDelete={() => setDeleteTarget(emp.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Employee"
        message="Are you sure you want to remove this employee? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {editing ? "Edit Employee" : "Add Employee"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              {error && (
                <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "First Name",
                    field: "firstName",
                    placeholder: "Jean",
                    required: true,
                  },
                  {
                    label: "Last Name",
                    field: "lastName",
                    placeholder: "Mutabazi",
                    required: true,
                  },
                  {
                    label: "Email",
                    field: "email",
                    placeholder: "jean@restaurant.com",
                    required: true,
                  },
                  {
                    label: "Phone",
                    field: "phone",
                    placeholder: "+250 788 000 001",
                    required: true,
                  },
                  {
                    label: "Role / Job Title",
                    field: "role",
                    placeholder: "Head Chef",
                    required: true,
                  },
                  {
                    label: "Monthly Salary ($)",
                    field: "salary",
                    placeholder: "800",
                  },
                  {
                    label: "Start Date",
                    field: "startDate",
                    placeholder: "2024-01-15",
                  },
                ].map(({ label, field, placeholder, required }) => (
                  <label key={field} className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      {label}
                    </span>
                    <input
                      value={(form as Record<string, string>)[field]}
                      onChange={set(field)}
                      placeholder={placeholder}
                      required={required}
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                    />
                  </label>
                ))}
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Profile Photo
                    </span>
                    <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-4 text-center transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {form.image ? (
                        <div className="flex flex-col items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.image}
                            alt="Employee photo"
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-green-200 dark:ring-green-800"
                          />
                          <span className="text-xs font-semibold text-neutral-500">
                            {uploading ? "Uploading…" : "Click to change photo"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {uploading ? (
                            <Loader2 size={20} className="animate-spin text-[#22c51f]" />
                          ) : (
                            <Upload size={20} className="text-[#22c51f]" />
                          )}
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            {uploading ? "Uploading…" : "Upload profile photo"}
                          </span>
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                            Max 5 MB · JPEG, PNG, WebP
                          </span>
                        </div>
                      )}
                    </label>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Notes
                    </span>
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={2}
                      placeholder="Optional notes about this employee…"
                      className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#22c51f] focus:ring-1 focus:ring-green-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#22c555]"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#22c51f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1bad1a] disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? "Save changes" : "Add employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
