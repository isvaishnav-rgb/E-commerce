export type UserRole = "admin" | "provider" | "user";

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface CartItem {
  product: string; // ObjectId as string
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: Address;
  cart: CartItem[];
  wishlist: string[];
  orders: string[];
  isProviderVerified: boolean;
  isActive: boolean;
  verified: boolean;
  isUserLoggedIn: boolean;
  createdAt: string;
  updatedAt: string;
}
