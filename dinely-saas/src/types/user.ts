export type UserRole = "owner" | "customer";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  restaurantId?: string; // set after onboarding for owners
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  restaurantId?: string;
  avatar?: string;
}
