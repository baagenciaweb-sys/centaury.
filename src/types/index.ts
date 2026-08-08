export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  sizes?: string[];
  stockBySize?: { [size: string]: number };
  createdAt: Date;
  updatedAt: Date;
}
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}
