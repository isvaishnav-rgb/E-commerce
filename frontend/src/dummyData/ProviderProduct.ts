export interface ProviderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  status: "Active" | "Inactive";
  description: string;
  category: string;
  stock: number;
}

export const providerProducts: ProviderProduct[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    image: "https://via.placeholder.com/300",
    status: "Active",
    description: "High-quality wireless headphones with noise cancellation.",
    category: "Electronics",
    stock: 25,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    image: "https://via.placeholder.com/300",
    status: "Active",
    description: "Smart watch with heart-rate monitoring and fitness tracking.",
    category: "Electronics",
    stock: 12,
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1999,
    image: "https://via.placeholder.com/300",
    status: "Inactive",
    description: "Portable Bluetooth speaker with deep bass and long battery life.",
    category: "Audio",
    stock: 0,
  },
];

