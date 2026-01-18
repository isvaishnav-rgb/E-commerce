export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  status: "Active" | "Inactive" | "OutOfStock";
  isFeatured: boolean;
}
