import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { User, Product, Order, Category, Coupon, DashboardStats, Review, Payment } from './src/types';
import { INITIAL_PRODUCTS } from './src/initialProducts';

const LOCAL_DB_PATH = path.join(process.cwd(), 'db-fallback.json');

// Global state for memory mode (reads from file on start, writes to file on change)
let isMongo = false;

// Dynamic check for MongoDB Env Var
const mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI !== 'MY_MONGODB_URI' ? process.env.MONGODB_URI : null;

// Standard Mongoose Schema definitions if Mongo is active
let UserModel: any = null;
let ProductModel: any = null;
let OrderModel: any = null;
let CategoryModel: any = null;
let CouponModel: any = null;
let PaymentModel: any = null;

if (mongoUri) {
  try {
    const userSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      email: { type: String, unique: true, sparse: true },
      phone: { type: String, unique: true, sparse: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      blocked: { type: Boolean, default: false },
      addresses: [{
        id: String,
        name: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean
      }],
      createdAt: { type: String, default: () => new Date().toISOString() }
    });

    const productSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      colors: [String],
      colorNames: [String],
      storages: [String],
      specs: mongoose.Schema.Types.Map,
      ratings: {
        average: { type: Number, default: 5 },
        count: { type: Number, default: 0 }
      },
      reviews: [{
        id: String,
        userId: String,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: String
      }],
      images: [String],
      stock: { type: Number, required: true },
      isFeatured: Boolean,
      isNewArrival: Boolean,
      isBestSeller: Boolean,
      isTrending: Boolean
    });

    const orderSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      items: [{
        productId: String,
        name: String,
        image: String,
        priceAtPurchase: Number,
        quantity: Number,
        color: String,
        storage: String
      }],
      status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
      subtotal: Number,
      discount: Number,
      tax: Number,
      total: Number,
      shippingAddress: {
        id: String,
        name: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      },
      paymentMethod: String,
      trackingNumber: String,
      createdAt: { type: String, default: () => new Date().toISOString() }
    });

    const categorySchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      slug: { type: String, required: true, unique: true }
    });

    const couponSchema = new mongoose.Schema({
      code: { type: String, required: true, unique: true },
      discountPercent: { type: Number, required: true },
      isActive: { type: Boolean, default: true },
      expiresAt: { type: String, required: true }
    });

    const paymentSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      orderId: { type: String, required: true },
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      amount: { type: Number, required: true },
      upiId: { type: String, required: true },
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      transactionRef: { type: String, required: true },
      createdAt: { type: String, default: () => new Date().toISOString() }
    });

    UserModel = mongoose.models.User || mongoose.model('User', userSchema);
    ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
    OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
    CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
    CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
    PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
  } catch (err) {
    console.warn("Mongoose modeling helper error (will fallback):", err);
  }
}


// Full offline local DB structure
interface LocalDBStructure {
  users: any[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  coupons: Coupon[];
}

// Default seed data for Categories and Coupons
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-iphones', name: 'iPhones', description: 'Apple iPhone models spanning multiple generations.', slug: 'iphones' },
  { id: 'cat-watches', name: 'Apple Watch', description: 'The ultimate health and activity smartwatch series.', slug: 'watches' },
  { id: 'cat-airpods', name: 'AirPods', description: 'Immersive sound and active noise cancelling earbuds.', slug: 'airpods' },
  { id: 'cat-macbooks', name: 'Mac', description: 'Laptops and computers engineered for ultimate computation.', slug: 'macbooks' },
  { id: 'cat-ipads', name: 'iPads', description: 'Versatile tablets supporting Apple Pencil and Magic Keyboards.', slug: 'ipads' },
  { id: 'cat-visionpro', name: 'Apple Vision Pro', description: 'A spatial computing headset blending digital content.', slug: 'visionpro' },
  { id: 'cat-accessories', name: 'Accessories', description: 'Essential chargers, cases, pencils, and cables.', slug: 'accessories' }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'APPLE10', discountPercent: 10, isActive: true, expiresAt: '2027-12-31T23:59:59Z' },
  { code: 'IPHONE16', discountPercent: 15, isActive: true, expiresAt: '2027-12-31T23:59:59Z' }
];

// Read physical JSON file database
function readLocalFile(): LocalDBStructure {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialStore: LocalDBStructure = {
        users: [],
        products: INITIAL_PRODUCTS,
        orders: [],
        categories: DEFAULT_CATEGORIES,
        coupons: DEFAULT_COUPONS
      };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
      return initialStore;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    const store = JSON.parse(raw);
    
    // Safety check to ensure default data is populated if empty
    if (!store.products || store.products.length === 0) store.products = INITIAL_PRODUCTS;
    if (!store.categories || store.categories.length === 0) store.categories = DEFAULT_CATEGORIES;
    if (!store.coupons || store.coupons.length === 0) store.coupons = DEFAULT_COUPONS;
    
    return store;
  } catch (err) {
    console.error("Local database read mismatch, resetting store:", err);
    return {
      users: [],
      products: INITIAL_PRODUCTS,
      orders: [],
      categories: DEFAULT_CATEGORIES,
      coupons: DEFAULT_COUPONS
    };
  }
}

// Write to physical JSON database
function writeLocalFile(data: LocalDBStructure) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to commit database entry changes:", err);
  }
}

export async function initDb() {
  if (mongoUri) {
    try {
      console.log("Attaching to MongoDB Atlas Cluster...");
      mongoose.set('strictQuery', false);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      isMongo = true;
      console.log("==========================================");
      console.log("🚀 MONGODB ATLAS CONNECTED SUCCESSFULLY! ");
      console.log("==========================================");

      // Seed default values on Mongo if empty
      const userCount = await UserModel.countDocuments();
      const prodCount = await ProductModel.countDocuments();
      const catCount = await CategoryModel.countDocuments();
      const couponCount = await CouponModel.countDocuments();

      if (prodCount === 0) {
        console.log("Seeding premium default products on MongoDB Atlas...");
        await ProductModel.insertMany(INITIAL_PRODUCTS);
      }
      if (catCount === 0) {
        await CategoryModel.insertMany(DEFAULT_CATEGORIES);
      }
      if (couponCount === 0) {
        await CouponModel.insertMany(DEFAULT_COUPONS);
      }
    } catch (err) {
      console.error("⛔ MongoDB Connection Refused. Engaging High-Reliability Local JSON Fallback...");
      console.error(err);
      isMongo = false;
      readLocalFile(); // Seeds local file
    }
  } else {
    isMongo = false;
    console.log("==========================================");
    console.log("💾 LOCAL DB ACTIVATED: Local JSON Fallback");
    console.log(`Path: ${LOCAL_DB_PATH}`);
    console.log("==========================================");
    readLocalFile(); // Seeds local file
  }
}

// ====================== USER METHODS ======================

export function formatIndianPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+${cleaned}`;
}

export async function getUserByPhone(phone: string): Promise<any | null> {
  const normPhone = formatIndianPhone(phone);
  if (!normPhone) return null;
  if (isMongo) {
    return await UserModel.findOne({ phone: normPhone }).lean();
  } else {
    const store = readLocalFile();
    const user = store.users.find(u => u.phone === normPhone);
    return user || null;
  }
}

export async function getUsers(): Promise<any[]> {
  if (isMongo) {
    return await UserModel.find().select('-password').lean();
  } else {
    const store = readLocalFile();
    return store.users.map(({ password, ...u }) => u);
  }
}

export async function getUserByEmail(email: string): Promise<any | null> {
  if (!email) return null;
  if (isMongo) {
    return await UserModel.findOne({ email: email.toLowerCase() }).lean();
  } else {
    const store = readLocalFile();
    const user = store.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }
}

export async function getUserById(id: string): Promise<any | null> {
  if (isMongo) {
    return await UserModel.findOne({ id }).select('-password').lean();
  } else {
    const store = readLocalFile();
    const user = store.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

export async function createUser(user: any): Promise<any> {
  const normalizedUser = { ...user };
  if (normalizedUser.email) {
    normalizedUser.email = normalizedUser.email.toLowerCase();
  } else if (normalizedUser.phone) {
    const normPhone = formatIndianPhone(normalizedUser.phone);
    normalizedUser.phone = normPhone;
    normalizedUser.email = `${normPhone.replace('+', '')}@apple-store.in`;
  }
  if (normalizedUser.phone) {
    normalizedUser.phone = formatIndianPhone(normalizedUser.phone);
  }
  
  if (isMongo) {
    const result = await UserModel.create(normalizedUser);
    return result.toObject();
  } else {
    const store = readLocalFile();
    store.users.push(normalizedUser);
    writeLocalFile(store);
    const { password, ...safe } = normalizedUser;
    return safe;
  }
}

export async function updateUser(id: string, updates: any): Promise<any | null> {
  if (isMongo) {
    const updated = await UserModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).select('-password').lean();
    return updated;
  } else {
    const store = readLocalFile();
    const idx = store.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    // Merge updates, don't allow password override in safe update unless specified
    store.users[idx] = { ...store.users[idx], ...updates };
    writeLocalFile(store);
    const { password, ...safe } = store.users[idx];
    return safe;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  if (isMongo) {
    const res = await UserModel.deleteOne({ id });
    return res.deletedCount > 0;
  } else {
    const store = readLocalFile();
    const originalLength = store.users.length;
    store.users = store.users.filter(u => u.id !== id);
    writeLocalFile(store);
    return store.users.length < originalLength;
  }
}

// ====================== PRODUCT METHODS ======================

export async function getProducts(options?: { category?: string; query?: string }): Promise<Product[]> {
  let list: Product[] = [];
  if (isMongo) {
    list = await ProductModel.find().lean();
  } else {
    const store = readLocalFile();
    list = store.products;
  }

  // Filter in memory for maximum compatibility
  if (options?.category) {
    list = list.filter(p => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options?.query) {
    const q = options.query.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isMongo) {
    return await ProductModel.findOne({ id }).lean();
  } else {
    const store = readLocalFile();
    const prod = store.products.find(p => p.id === id);
    return prod || null;
  }
}

export async function createProduct(product: Product): Promise<Product> {
  if (isMongo) {
    const res = await ProductModel.create(product);
    return res.toObject();
  } else {
    const store = readLocalFile();
    store.products.push(product);
    writeLocalFile(store);
    return product;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isMongo) {
    return await ProductModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
  } else {
    const store = readLocalFile();
    const idx = store.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    store.products[idx] = { ...store.products[idx], ...updates } as Product;
    writeLocalFile(store);
    return store.products[idx];
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isMongo) {
    const res = await ProductModel.deleteOne({ id });
    return res.deletedCount > 0;
  } else {
    const store = readLocalFile();
    const originalLength = store.products.length;
    store.products = store.products.filter(p => p.id !== id);
    writeLocalFile(store);
    return store.products.length < originalLength;
  }
}

// Add a review dynamically
export async function addProductReview(id: string, review: Review): Promise<Product | null> {
  if (isMongo) {
    // Re-calculate ratings average and count
    const product = await ProductModel.findOne({ id });
    if (!product) return null;
    product.reviews.push(review);
    
    const count = product.reviews.length;
    const avg = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / count;
    product.ratings = { average: parseFloat(avg.toFixed(1)), count };
    await product.save();
    return product.toObject();
  } else {
    const store = readLocalFile();
    const idx = store.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    const reviews = store.products[idx].reviews || [];
    reviews.push(review);
    const count = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / count;
    
    store.products[idx].reviews = reviews;
    store.products[idx].ratings = {
      average: parseFloat(avg.toFixed(1)),
      count
    };
    
    writeLocalFile(store);
    return store.products[idx];
  }
}

// ====================== CATEGORY METHODS ======================

export async function getCategories(): Promise<Category[]> {
  if (isMongo) {
    return await CategoryModel.find().lean();
  } else {
    const store = readLocalFile();
    return store.categories;
  }
}

export async function createCategory(cat: Category): Promise<Category> {
  if (isMongo) {
    const res = await CategoryModel.create(cat);
    return res.toObject();
  } else {
    const store = readLocalFile();
    store.categories.push(cat);
    writeLocalFile(store);
    return cat;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isMongo) {
    const res = await CategoryModel.deleteOne({ id });
    return res.deletedCount > 0;
  } else {
    const store = readLocalFile();
    const prevLen = store.categories.length;
    store.categories = store.categories.filter(c => c.id !== id);
    writeLocalFile(store);
    return store.categories.length < prevLen;
  }
}

// ====================== COUPON METHODS ======================

export async function getCoupons(): Promise<Coupon[]> {
  if (isMongo) {
    return await CouponModel.find().lean();
  } else {
    const store = readLocalFile();
    return store.coupons;
  }
}

export async function createCoupon(coupon: Coupon): Promise<Coupon> {
  if (isMongo) {
    const res = await CouponModel.create(coupon);
    return res.toObject();
  } else {
    const store = readLocalFile();
    store.coupons.push(coupon);
    writeLocalFile(store);
    return coupon;
  }
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  if (isMongo) {
    return await CouponModel.findOne({ code: code.toUpperCase() }).lean();
  } else {
    const store = readLocalFile();
    const c = store.coupons.find(coupon => coupon.code.toUpperCase() === code.toUpperCase());
    return c || null;
  }
}

export async function deleteCoupon(code: string): Promise<boolean> {
  if (isMongo) {
    const res = await CouponModel.deleteOne({ code: code.toUpperCase() });
    return res.deletedCount > 0;
  } else {
    const store = readLocalFile();
    const prev = store.coupons.length;
    store.coupons = store.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    writeLocalFile(store);
    return store.coupons.length < prev;
  }
}

// ====================== ORDER METHODS ======================

export async function getOrders(): Promise<Order[]> {
  if (isMongo) {
    return await OrderModel.find().sort({ createdAt: -1 }).lean();
  } else {
    const store = readLocalFile();
    return [...store.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (isMongo) {
    return await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
  } else {
    const store = readLocalFile();
    return store.orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isMongo) {
    return await OrderModel.findOne({ id }).lean();
  } else {
    const store = readLocalFile();
    const o = store.orders.find(order => order.id === id);
    return o || null;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  if (isMongo) {
    const res = await OrderModel.create(order);
    
    // Decrement stocks for product items
    for (const item of order.items) {
      await ProductModel.findOneAndUpdate(
        { id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }
    
    return res.toObject();
  } else {
    const store = readLocalFile();
    store.orders.push(order);
    
    // Decrement stock in memory & file
    for (const item of order.items) {
      const idx = store.products.findIndex(p => p.id === item.productId);
      if (idx !== -1) {
        store.products[idx].stock = Math.max(0, store.products[idx].stock - item.quantity);
      }
    }
    
    writeLocalFile(store);
    return order;
  }
}

export async function updateOrderStatus(id: string, status: Order['status'], trackingNumber?: string): Promise<Order | null> {
  const updates: any = { status };
  if (trackingNumber !== undefined) {
    updates.trackingNumber = trackingNumber;
  }
  
  if (isMongo) {
    return await OrderModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
  } else {
    const store = readLocalFile();
    const idx = store.orders.findIndex(o => o.id === id);
    if (idx === -1) return null;
    store.orders[idx] = { ...store.orders[idx], ...updates };
    writeLocalFile(store);
    return store.orders[idx];
  }
}

// ====================== ANALYTICS METHODS ======================

export async function getDashboardStats(): Promise<DashboardStats> {
  let usersList: any[] = [];
  let productsList: Product[] = [];
  let ordersList: Order[] = [];

  if (isMongo) {
    usersList = await UserModel.find().lean();
    productsList = await ProductModel.find().lean();
    ordersList = await OrderModel.find().lean();
  } else {
    const store = readLocalFile();
    usersList = store.users;
    productsList = store.products;
    ordersList = store.orders;
  }

  // Calculate stats
  const totalUsers = usersList.length;
  const totalProducts = productsList.length;
  const totalOrders = ordersList.length;
  
  // Exclude cancelled orders from revenue calculation
  const completedOrders = ordersList.filter(o => o.status !== 'cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  // Group by month (last 6 months)
  const monthlySalesMap: { [month: string]: { sales: number; orders: number } } = {};
  
  // Initialize last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    monthlySalesMap[label] = { sales: 0, orders: 0 };
  }

  for (const order of ordersList) {
    const date = new Date(order.createdAt);
    const label = `${months[date.getMonth()]} ${date.getFullYear().toString().substring(2)}`;
    if (monthlySalesMap[label] !== undefined) {
      monthlySalesMap[label].orders += 1;
      if (order.status !== 'cancelled') {
        monthlySalesMap[label].sales += order.total;
      }
    }
  }

  const monthlySales = Object.keys(monthlySalesMap).map(key => ({
    month: key,
    sales: parseFloat(monthlySalesMap[key].sales.toFixed(2)),
    orders: monthlySalesMap[key].orders
  }));

  const recentOrders = [...ordersList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalUsers,
    totalOrders,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalProducts,
    monthlySales,
    recentOrders
  };
}
