export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const recommendedProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 1999, image: "https://via.placeholder.com/300" },
  { id: 2, name: "Smart Watch", price: 2999, image: "https://via.placeholder.com/300" },
  { id: 3, name: "Bluetooth Speaker", price: 1499, image: "https://via.placeholder.com/300" },
  { id: 1, name: "Wireless Headphones", price: 1999, image: "https://via.placeholder.com/300" }
];

export const favouriteProducts: Product[] = [
  { id: 4, name: "Running Shoes", price: 2499, image: "https://via.placeholder.com/300" },
  { id: 5, name: "Leather Wallet", price: 999, image: "https://via.placeholder.com/300" },
  { id: 6, name: "Sunglasses", price: 1299, image: "https://via.placeholder.com/300" },
];

export const popularProducts: Product[] = [
  { id: 7, name: "Gaming Mouse", price: 1799, image: "https://via.placeholder.com/300" },
  { id: 8, name: "Mechanical Keyboard", price: 3499, image: "https://via.placeholder.com/300" },
  { id: 9, name: "Monitor 24 inch", price: 9999, image: "https://via.placeholder.com/300" },
];

export const mostPurchasedProducts: Product[] = [
  { id: 10, name: "Power Bank", price: 1199, image: "https://via.placeholder.com/300" },
  { id: 11, name: "USB Cable", price: 299, image: "https://via.placeholder.com/300" },
  { id: 12, name: "Mobile Cover", price: 499, image: "https://via.placeholder.com/300" },
];
