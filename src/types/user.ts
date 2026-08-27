export type UserRole = "owner" | "customer";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  restaurant_id?: string;
  avatar?: string;
  address?: string;
  favourites?: string[];
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  restaurant_id?: string;
  avatar?: string;
}
