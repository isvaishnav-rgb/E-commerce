export type UserRole = "admin" | "provider" | "user";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };

  isProviderVerified: boolean;
  isActive: boolean;
  verified: boolean;
  isUserLoggedIn: boolean;

  cart: {
    product: string;
    quantity: number;
  }[];

  wishlist: string[];
  orders: string[];

  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}
