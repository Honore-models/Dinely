import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// ─── Restaurant ───────────────────────────────────────────────────────────────

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  type: z.string().min(2, "Restaurant type is required"),
  address: z.string().min(4, "Address is required"),
  openingHours: z.string().min(4, "Opening hours are required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Enter a valid email"),
  logo: z.string().optional(),
  description: z.string().optional(),
});

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const menuItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  category: z.string().min(2, "Category is required"),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
  image: z.string().optional(),
  mealTimes: z.array(z.string()).optional(),
  priceRange: z.string().optional(),
  available: z.boolean().optional(),
});

// ─── Order ────────────────────────────────────────────────────────────────────

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant is required"),
  items: z.array(orderItemSchema).min(1, "At least one item required"),
  type: z.enum(["Delivery", "Takeaway", "Dine-in"]),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Active", "Completed", "Cancelled"]),
});

// ─── Booking ──────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  restaurantId: z.string().min(1),
  tableId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  partySize: z.number().int().positive(),
  notes: z.string().optional(),
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Comment is required").max(1000),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(3).max(1000).optional(),
});

// ─── Table ────────────────────────────────────────────────────────────────────

export const tableSchema = z.object({
  number: z.number().int().positive("Table number is required"),
  capacity: z.number().int().positive("Capacity is required"),
  location: z.string().optional(),
  status: z.enum(["available", "occupied", "reserved", "inactive"]).optional(),
});

// ─── Employee ─────────────────────────────────────────────────────────────────

export const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  role: z.string().min(2, "Role is required"),
  salary: z.number().nonnegative().optional(),
  startDate: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Customer registration ────────────────────────────────────────────────────

export const customerRegisterSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ─── Customer profile update ──────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  address: z.string().optional(),
  avatar: z.string().optional(),
});

// ─── Favourites ───────────────────────────────────────────────────────────────

export const favouriteSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RestaurantInput = z.infer<typeof restaurantSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type TableInput = z.infer<typeof tableSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
