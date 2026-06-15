// Typed fetch wrappers for every API endpoint.
// These are used by the hooks (useAuth, useMenu, useOrders, etc.)

const BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  me: () => apiFetch<{ user: Record<string, unknown> | null }>("/auth"),

  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    apiFetch<{ message: string; userId: string }>("/auth?action=register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  registerCustomer: (body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) =>
    apiFetch<{ message: string; userId: string }>(
      "/auth?action=register-customer",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    ),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ message: string; user: Record<string, unknown> }>(
      "/auth?action=login",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    ),

  logout: () =>
    apiFetch<{ message: string }>("/auth?action=logout", { method: "POST" }),

  updateProfile: (body: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) =>
    apiFetch<{ message: string; user: Record<string, unknown> }>("/auth", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ─── Restaurants ──────────────────────────────────────────────────────────────

export const restaurantsApi = {
  list: (params?: {
    search?: string;
    category?: string;
    rating?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    if (params?.rating) qs.set("rating", String(params.rating));
    const q = qs.toString();
    return apiFetch<{ data: Record<string, unknown>[] }>(
      `/restaurants${q ? `?${q}` : ""}`,
    );
  },

  mine: () =>
    apiFetch<{ data: Record<string, unknown> | null }>(
      "/restaurants?mine=true",
    ),

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/restaurants/${id}`),

  create: (body: Record<string, unknown>) =>
    apiFetch<{ message: string; restaurantId: string }>("/restaurants", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ message: string }>(`/restaurants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/restaurants/${id}`, { method: "DELETE" }),
};

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const menuApi = {
  list: (restaurantId?: string) =>
    apiFetch<{ data: Record<string, unknown>[] }>(
      restaurantId ? `/menu?restaurantId=${restaurantId}` : "/menu",
    ),

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/menu/${id}`),

  create: (body: Record<string, unknown>) =>
    apiFetch<{ message: string; id: string }>("/menu", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ message: string }>(`/menu/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/menu/${id}`, { method: "DELETE" }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return apiFetch<{ data: Record<string, unknown>[]; total: number }>(
      `/orders${q ? `?${q}` : ""}`,
    );
  },

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/orders/${id}`),

  create: (body: {
    restaurantId: string;
    items: {
      menuItemId: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    type: "Delivery" | "Takeaway" | "Dine-in";
    deliveryAddress?: string;
    notes?: string;
  }) =>
    apiFetch<{ message: string; orderId: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateStatus: (
    id: string,
    status: "Pending" | "Active" | "Completed" | "Cancelled",
  ) =>
    apiFetch<{ message: string }>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  cancel: (id: string) =>
    apiFetch<{ message: string }>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Cancelled" }),
    }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  list: (params?: { date?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.date) qs.set("date", params.date);
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return apiFetch<{ data: Record<string, unknown>[] }>(
      `/bookings${q ? `?${q}` : ""}`,
    );
  },

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/bookings/${id}`),

  create: (body: {
    restaurantId: string;
    date: string;
    time: string;
    partySize: number;
    tableId?: string;
    notes?: string;
  }) =>
    apiFetch<{ message: string; bookingId: string }>("/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (
    id: string,
    body: { status?: string; tableId?: string; notes?: string },
  ) =>
    apiFetch<{ message: string }>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  cancel: (id: string) =>
    apiFetch<{ message: string }>(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Cancelled" }),
    }),
};

// ─── Clients ──────────────────────────────────────────────────────────────────

export const clientsApi = {
  list: (search?: string) =>
    apiFetch<{ data: Record<string, unknown>[] }>(
      search ? `/clients?search=${encodeURIComponent(search)}` : "/clients",
    ),

  get: (id: string) =>
    apiFetch<{
      data: {
        user: Record<string, unknown>;
        orders: Record<string, unknown>[];
      };
    }>(`/clients/${id}`),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  list: (restaurantId: string, params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams({ restaurantId });
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<{
      data: Record<string, unknown>[];
      total: number;
      avgRating: number;
    }>(`/reviews?${qs.toString()}`);
  },

  create: (body: { restaurantId: string; rating: number; comment: string }) =>
    apiFetch<{ message: string; reviewId: string }>("/reviews", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: { rating?: number; comment?: string }) =>
    apiFetch<{ message: string }>(`/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/reviews/${id}`, { method: "DELETE" }),

  markHelpful: (id: string) =>
    apiFetch<{ message: string }>(`/reviews/${id}`, { method: "POST" }),
};

// ─── Tables ───────────────────────────────────────────────────────────────────

export const tablesApi = {
  list: (restaurantId?: string) =>
    apiFetch<{ data: Record<string, unknown>[] }>(
      restaurantId ? `/tables?restaurantId=${restaurantId}` : "/tables",
    ),

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/tables/${id}`),

  create: (body: {
    number: number;
    capacity: number;
    location?: string;
    status?: string;
  }) =>
    apiFetch<{ message: string; id: string }>("/tables", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ message: string }>(`/tables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/tables/${id}`, { method: "DELETE" }),
};

// ─── Employees ────────────────────────────────────────────────────────────────

export const employeesApi = {
  list: (search?: string) =>
    apiFetch<{ data: Record<string, unknown>[] }>(
      search
        ? `/employees?search=${encodeURIComponent(search)}`
        : "/employees",
    ),

  get: (id: string) =>
    apiFetch<{ data: Record<string, unknown> }>(`/employees/${id}`),

  create: (body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    salary?: number;
    startDate?: string;
    notes?: string;
  }) =>
    apiFetch<{ message: string; id: string }>("/employees", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Record<string, unknown>) =>
    apiFetch<{ message: string }>(`/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/employees/${id}`, { method: "DELETE" }),
};

// ─── Favourites ───────────────────────────────────────────────────────────────

export const favouritesApi = {
  list: () => apiFetch<{ data: Record<string, unknown>[] }>("/favourites"),

  add: (restaurantId: string) =>
    apiFetch<{ message: string }>("/favourites", {
      method: "POST",
      body: JSON.stringify({ restaurantId }),
    }),

  remove: (restaurantId: string) =>
    apiFetch<{ message: string }>(
      `/favourites?restaurantId=${restaurantId}`,
      { method: "DELETE" },
    ),
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsApi = {
  get: (period?: "7d" | "30d" | "90d") =>
    apiFetch<{
      revenue: { current: number; previous: number; change: number };
      orders: { current: number; previous: number; change: number };
      customers: { current: number; previous: number; change: number };
      avgOrderValue: { current: number; previous: number; change: number };
      revenueChart: { date: string; revenue: number; orders: number }[];
      ordersByType: { type: string; count: number }[];
      ordersByStatus: { status: string; count: number }[];
      topItems: { id: string; name: string; quantity: number; revenue: number }[];
    }>(`/analytics${period ? `?period=${period}` : ""}`),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
  createCheckout: (plan: string, billingCycle: string) =>
    apiFetch<{ url: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({ plan, billingCycle }),
    }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadApi = {
  upload: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data as { url: string };
  },
};
