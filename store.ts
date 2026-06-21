import { create } from 'zustand';
import { User, Product, CartItem, Order, Coupon, Address, DashboardStats, Category } from './types';

// Synchronous safe client-side localStorage helpers
const getSaved = (key: string, fallback: any) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const saveItem = (key: string, val: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Local storage sync error:", err);
  }
};

interface AppStore {
  // Navigation & Routing systems
  currentView: string;
  currentViewParams: any | null;
  setView: (view: string, params?: any) => void;
  syncAuth: () => void;

  // Authentication
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authError: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  registerPhone: (name: string, phone: string, password: string, otp: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (phone: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (phone: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  
  // Catalog Browse
  products: Product[];
  currentProduct: Product | null;
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  activeFilter: string; // 'all' | 'featured' | 'new' | 'bestseller' | 'trending'
  loadingProducts: boolean;
  fetchProducts: (query?: string, category?: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  addReview: (productId: string, rating: number, comment: string) => Promise<boolean>;

  // Cart Management
  cart: CartItem[];
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  addToCart: (product: Product, quantity: number, color: string, storage: string) => void;
  removeFromCart: (productId: string, color: string, storage: string) => void;
  updateCartQuantity: (productId: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  getCartSummary: () => { subtotal: number; discount: number; tax: number; shipping: number; total: number };

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;

  // Checkout & Customer Orders
  orders: Order[];
  ordersLoading: boolean;
  fetchMyOrders: () => Promise<void>;
  placeOrder: (shippingAddress: Address, paymentMethod: string) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  cancelUserOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;

  // Admin Dashboard Management Portal
  adminStats: DashboardStats | null;
  adminUsers: any[];
  adminOrders: Order[];
  adminCoupons: Coupon[];
  adminCategories: Category[];
  loadingAdmin: boolean;
  fetchAdminStats: () => Promise<void>;
  fetchAdminUsers: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>;
  fetchAdminCoupons: () => Promise<void>;
  fetchAdminCategories: () => Promise<void>;
  blockUser: (userId: string, blocked: boolean) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  addAdminProduct: (prod: Omit<Product, 'id' | 'ratings' | 'reviews'>) => Promise<boolean>;
  updateAdminProduct: (id: string, prod: Partial<Product>) => Promise<boolean>;
  deleteAdminProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status'], tracking?: string) => Promise<boolean>;
  addCoupon: (code: string, discountPercent: number, expiry?: string) => Promise<boolean>;
  deleteCoupon: (code: string) => Promise<boolean>;
  addCategory: (name: string, description: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  bulkUploadProducts: (productsList: Product[]) => Promise<boolean>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Navigation & Routing Initial State
  currentView: (() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/signup') return 'signup';
      if (path === '/signin') return 'login';
    }
    return 'home';
  })(),
  currentViewParams: null,
  setView: (view, params = null) => {
    set({ currentView: view, currentViewParams: params });
    if (typeof window !== 'undefined') {
      let nextPath = '/';
      if (view === 'login') {
        nextPath = '/signin';
      } else if (view === 'signup') {
        nextPath = '/signup';
      } else if (view === 'home') {
        nextPath = '/';
      } else {
        // Keep standard views under root path in SPA model
        nextPath = '/';
      }
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ view, params }, '', nextPath);
      }
    }
  },
  
  // Theme Management Initial State
  isDarkMode: getSaved('apple_dark_mode', false),
  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    saveItem('apple_dark_mode', next);
    set({ isDarkMode: next });
  },

  syncAuth: () => {
    const token = getSaved('apple_token', null);
    const user = getSaved('apple_user', null);
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },

  // Auth initial state
  user: getSaved('apple_user', null),
  token: getSaved('apple_token', null),
  isAuthenticated: !!getSaved('apple_token', null),
  authError: null,
  authLoading: false,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      saveItem('apple_token', data.token);
      saveItem('apple_user', data.user);
      set({ token: data.token, user: data.user, isAuthenticated: true, authLoading: false });
      return true;
    } catch (err: any) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      saveItem('apple_token', data.token);
      saveItem('apple_user', data.user);
      set({ token: data.token, user: data.user, isAuthenticated: true, authLoading: false });
      return true;
    } catch (err: any) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  registerPhone: async (name, phone, password, otp) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Do NOT automatically log in or save items to storage; redirect to Sign In page first
      set({ authLoading: false });
      return true;
    } catch (err: any) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  sendOtp: async (phone) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  forgotPassword: async (phone) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send password recovery OTP');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  resetPassword: async (phone, otp, newPassword) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    localStorage.removeItem('apple_token');
    localStorage.removeItem('apple_user');
    set({ token: null, user: null, isAuthenticated: false, orders: [], adminStats: null });
  },

  updateProfile: async (name: string) => {
    const { token, user } = get();
    if (!token || !user) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      saveItem('apple_user', data.user);
      set({ user: data.user });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  addAddress: async (addressData) => {
    const { token, user } = get();
    if (!token || !user) return false;
    try {
      const res = await fetch('/api/auth/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      saveItem('apple_user', data.user);
      set({ user: data.user });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteAddress: async (addressId) => {
    const { token, user } = get();
    if (!token || !user) return false;
    try {
      const res = await fetch(`/api/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      saveItem('apple_user', data.user);
      set({ user: data.user });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Catalog Browse Section
  products: [],
  currentProduct: null,
  categories: [],
  searchQuery: '',
  selectedCategory: '',
  activeFilter: 'all',
  loadingProducts: false,

  fetchProducts: async (query, category) => {
    set({ loadingProducts: true });
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (query !== undefined) params.append('q', query);
      if (category !== undefined) params.append('category', category);
      
      const res = await fetch(url + (params.toString() ? `?${params.toString()}` : ''));
      const data = await res.json();
      
      // Fetch categories on catalog query
      const catRes = await fetch('/api/admin/categories');
      const catData = await catRes.json();

      set({ 
        products: data.products || [], 
        categories: catData.categories || [],
        loadingProducts: false 
      });
    } catch (err) {
      console.error(err);
      set({ loadingProducts: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (!res.ok) return null;
      set({ currentProduct: data.product });
      return data.product;
    } catch {
      return null;
    }
  },

  addReview: async (productId, rating, comment) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Update local catalogs
      set((state) => ({
        currentProduct: data.product,
        products: state.products.map(p => p.id === productId ? data.product : p)
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // Cart Handling
  cart: getSaved('apple_cart', []),
  coupon: getSaved('apple_coupon', null),

  applyCoupon: async (code) => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      
      saveItem('apple_coupon', data.coupon);
      set({ coupon: data.coupon });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  removeCoupon: () => {
    localStorage.removeItem('apple_coupon');
    set({ coupon: null });
  },

  addToCart: (product, quantity, color, storage) => {
    const { cart } = get();
    // Unique identifier combining Product + select values for cart sorting
    const existIdx = cart.findIndex(
      item => item.productId === product.id && 
              item.selectedColor === color && 
              item.selectedStorage === storage
    );

    let updated = [...cart];
    if (existIdx !== -1) {
      updated[existIdx].quantity += quantity;
    } else {
      updated.push({
        productId: product.id,
        product,
        quantity,
        selectedColor: color,
        selectedStorage: storage
      });
    }

    saveItem('apple_cart', updated);
    set({ cart: updated });
  },

  removeFromCart: (productId, color, storage) => {
    const { cart } = get();
    const updated = cart.filter(
      item => !(item.productId === productId && 
                item.selectedColor === color && 
                item.selectedStorage === storage)
    );
    saveItem('apple_cart', updated);
    set({ cart: updated });
  },

  updateCartQuantity: (productId, color, storage, quantity) => {
    const { cart } = get();
    const idx = cart.findIndex(
      item => item.productId === productId && 
              item.selectedColor === color && 
              item.selectedStorage === storage
    );
    if (idx === -1) return;

    let updated = [...cart];
    updated[idx].quantity = quantity;
    saveItem('apple_cart', updated);
    set({ cart: updated });
  },

  clearCart: () => {
    localStorage.removeItem('apple_cart');
    localStorage.removeItem('apple_coupon');
    set({ cart: [], coupon: null });
  },

  getCartSummary: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return sum + (price * item.quantity);
    }, 0);

    const discount = coupon ? (subtotal * coupon.discountPercent / 100) : 0;
    const taxRate = 0.0825; // 8.25% Apple simulated Sales Tax
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = taxableSubtotal * taxRate;
    
    // Free shipping above $1000, otherwise flat $15 rate
    const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 15;
    const total = taxableSubtotal + tax + shipping;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping,
      total: parseFloat(total.toFixed(2))
    };
  },

  // Wishlist Logic
  wishlist: getSaved('apple_wishlist', []),
  toggleWishlist: (product) => {
    const { wishlist } = get();
    const isExist = wishlist.some(item => item.id === product.id);
    let updated: Product[];
    if (isExist) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    saveItem('apple_wishlist', updated);
    set({ wishlist: updated });
  },

  // Customer Orders log
  orders: [],
  ordersLoading: false,

  fetchMyOrders: async () => {
    const { token } = get();
    if (!token) return;
    set({ ordersLoading: true });
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      set({ orders: data.orders || [], ordersLoading: false });
    } catch {
      set({ ordersLoading: false });
    }
  },

  placeOrder: async (shippingAddress, paymentMethod) => {
    const { token, cart, getCartSummary, clearCart } = get();
    if (!token) return { success: false, error: 'Login required to place command' };
    if (cart.length === 0) return { success: false, error: 'Your cart is currently empty' };

    const { subtotal, discount, tax, total } = getCartSummary();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            name: item.product.name,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedStorage: item.selectedStorage
          })),
          shippingAddress,
          paymentMethod,
          subtotal,
          discount,
          tax,
          total
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      clearCart();
      return { success: true, orderId: data.order.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  cancelUserOrder: async (orderId) => {
    const { token } = get();
    if (!token) return { success: false, error: 'Login required to cancel order' };

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel order');

      // Set orders mapping state 
      set(state => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // SECURED ADMINISTRATOR HANDLERS
  adminStats: null,
  adminUsers: [],
  adminOrders: [],
  adminCoupons: [],
  adminCategories: [],
  loadingAdmin: false,

  fetchAdminStats: async () => {
    const { token } = get();
    if (!token) return;
    set({ loadingAdmin: true });
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      set({ adminStats: data.stats || null, loadingAdmin: false });
    } catch {
      set({ loadingAdmin: false });
    }
  },

  fetchAdminUsers: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      set({ adminUsers: data.users || [] });
    } catch (err) {
      console.error(err);
    }
  },

  fetchAdminOrders: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      set({ adminOrders: data.orders || [] });
    } catch (err) {
      console.error(err);
    }
  },

  fetchAdminCoupons: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      set({ adminCoupons: data.coupons || [] });
    } catch (err) {
      console.error(err);
    }
  },

  fetchAdminCategories: async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      set({ adminCategories: data.categories || [] });
    } catch (err) {
      console.error(err);
    }
  },

  blockUser: async (userId, blocked) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ blocked })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh admin states
      set(state => ({
        adminUsers: state.adminUsers.map(u => u.id === userId ? { ...u, blocked } : u)
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteUser: async (userId) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh
      set(state => ({
        adminUsers: state.adminUsers.filter(u => u.id !== userId)
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  addAdminProduct: async (prodData) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prodData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh products on main catalog
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateAdminProduct: async (id, prodUpdates) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(prodUpdates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh catalog
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteAdminProduct: async (id) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh catalog
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateOrderStatus: async (id, status, tracking) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, trackingNumber: tracking })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      set(state => ({
        adminOrders: state.adminOrders.map(o => o.id === id ? data.order : o)
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  addCoupon: async (code, discountPercent, expiry) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code, discountPercent, expiresAt: expiry })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      get().fetchAdminCoupons();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteCoupon: async (code) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/coupons/${code}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      get().fetchAdminCoupons();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  addCategory: async (name, description) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      get().fetchAdminCategories();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  deleteCategory: async (id) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      get().fetchAdminCategories();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  bulkUploadProducts: async (productsList) => {
    const { token } = get();
    if (!token) return false;
    try {
      for (const prod of productsList) {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(prod)
        });
      }
      get().fetchProducts();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}));
