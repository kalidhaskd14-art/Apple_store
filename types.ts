/**
 * Core Type Definitions for the Apple Store eCommerce platform.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  blocked: boolean;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number; // Percentage discount eg. 10 for 10%
  colors: string[]; // Hex values or names e.g. ["#1E1E1E", "#E3E4E5"]
  colorNames: string[]; // Readable color names e.g. ["Titanium Gray", "Silver"]
  storages: string[]; // e.g. ["128GB", "256GB", "512GB", "1TB"]
  specs: { [key: string]: string }; // Technical specifications
  ratings: {
    average: number;
    count: number;
  };
  reviews: Review[];
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  priceAtPurchase: number;
  quantity: number;
  color: string;
  storage: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  monthlySales: { month: string; sales: number; orders: number }[];
  recentOrders: Order[];
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'verified' | 'failed';
  transactionRef: string;
  createdAt: string;
}
