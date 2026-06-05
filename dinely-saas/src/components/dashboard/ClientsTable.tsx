import React from "react";
import Image from "next/image";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  import React, { useState } from "react";
  import ClientProfileModal from "./ClientProfileModal";

const clients: Client[] = [
    const [selected, setSelected] = useState<null | Client>(null);
  {
    id: "1001",
    name: "John Lee",
    email: "john@gmail.com",
    phone: "+120 2525 2546",
    lastVisit: "14, October 2026",
    status: "active",
  },
  {
    id: "0098",
    name: "Ketty S",
    email: "ketty@gmail.com",
    phone: "+120 0928 2364",
    lastVisit: "11, October 2026",
    status: "new",
  },
  {
              <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="odd:bg-white even:bg-neutral-50 hover:bg-neutral-100 cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-700">
                          {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="font-medium text-neutral-900">{c.name}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <a
                        className="text-sm text-neutral-700 hover:underline"
                        href={`mailto:${c.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.email}
                      </a>
                    </td>
                    <td className="py-4">{c.phone}</td>
                    <td className="py-4">{c.id}</td>
                    <td className="py-4">{c.lastVisit}</td>
                    <td className="py-4">
                      {c.status === "active" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">active</span>
                      )}
                      {c.status === "new" && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">New</span>
                      )}
                      {c.status === "inactive" && (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-sm text-neutral-500">
                <th className="py-3 text-left">Name</th>
                <th className="py-3 text-left">Email</th>
                <th className="py-3 text-left">Phone number</th>
                <th className="py-3 text-left">Client ID</th>
                <th className="py-3 text-left">Last Visit</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
              {clients.map((c) => (
                <tr key={c.id} className="odd:bg-white even:bg-neutral-50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-700">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="font-medium text-neutral-900">
                        {c.name}
                      </div>
                    </div>
                  </td>

  {selected && (
    <ClientProfileModal client={selected} onClose={() => setSelected(null)} />
  )}
                  <td className="py-4">
                    <a
                      className="text-sm text-neutral-700 hover:underline"
                      href={`mailto:${c.email}`}
                    >
                      {c.email}
                    </a>
                  </td>
                  <td className="py-4">{c.phone}</td>
                  <td className="py-4">{c.id}</td>
                  <td className="py-4">{c.lastVisit}</td>
                  <td className="py-4">
                    {c.status === "active" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        active
                      </span>
                    )}
                    {c.status === "new" && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        New
                      </span>
                    )}
                    {c.status === "inactive" && (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                        inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <div>9 out of 50</div>
          <div className="flex items-center gap-2">
            <button className="h-7 w-7 rounded border border-neutral-200 text-neutral-600">
              ◀
            </button>
            <button className="h-7 w-7 rounded bg-emerald-600 text-white">
              1
            </button>
            <button className="h-7 w-7 rounded border border-neutral-200 text-neutral-600">
              2
            </button>
            <button className="h-7 w-7 rounded border border-neutral-200 text-neutral-600">
              3
            </button>
            <button className="h-7 w-7 rounded border border-neutral-200 text-neutral-600">
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientsTable;
