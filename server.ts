import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { createServer as createViteServer } from 'vite';
import {
  initDb,
  getUsers,
  getUserByEmail,
  getUserById,
  getUserByPhone,
  formatIndianPhone,
  createUser,
  updateUser,
  deleteUser,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getCategories,
  createCategory,
  deleteCategory,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getCouponByCode,
  getOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getDashboardStats
} from './server-db';
import { User, Address, Product, Review, Order, OrderItem, Category, Coupon } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// JWT Secret loading
const JWT_SECRET = process.env.JWT_SECRET || 'apple_premium_luxury_secret_key_2026';
// Super admin credentials from .env with fallback
const ADMIN_EMAIL = (process.env.ADMIN_ID || 'admin@apple.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Helper to generate JWT token
function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ---------------- MIDDLEWARES ----------------

// Validate JWT Token in Authed request
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    if (user.blocked) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    req.user = user;
    next();
  });
};

// Validate Admin Only access
const enforceAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrative privilege required' });
  }
  next();
};


// ---------------- REST API ROUTES ----------------

// --- AUTH SYSTEM ---

// Lazy-loading Twilio Credentials safely
let twilioClient: any = null;

function isTwilioConfigured(): boolean {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) return false;
  if (
    accountSid.includes('YOUR_ACCOUNT_SID') || 
    authToken.includes('YOUR_NEW_AUTH_TOKEN') || 
    serviceSid.includes('YOUR_VERIFY_SERVICE_SID') ||
    !accountSid.trim() || 
    !authToken.trim() || 
    !serviceSid.trim()
  ) {
    return false;
  }
  return true;
}

function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken || accountSid.includes('YOUR_ACCOUNT_SID') || authToken.includes('YOUR_NEW_AUTH_TOKEN') || !accountSid.trim() || !authToken.trim()) {
      throw new Error('Twilio Credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) are unconfigured. Please update them in the Secrets tab of the Settings menu.');
    }
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

function getVerifyServiceSid() {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!serviceSid || serviceSid.includes('YOUR_VERIFY_SERVICE_SID') || !serviceSid.trim()) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID environment variable is unconfigured or invalid.');
  }
  return serviceSid;
}

async function sendOtpCode(phone: string): Promise<{ success: boolean; message: string }> {
  if (!isTwilioConfigured()) {
    console.log(`[SANDBOX OTP] Generating sandbox code for ${phone}. Code: 123456`);
    return {
      success: true,
      message: '[Sandbox Mode] Verification OTP code is 123456. Click "Verify" to proceed!'
    };
  }
  const formatted = formatIndianPhone(phone);
  const client = getTwilioClient();
  const serviceSid = getVerifyServiceSid();

  await client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: formatted, channel: 'sms' });

  return { success: true, message: 'Verification OTP sent successfully' };
}

async function verifyOtpCode(phone: string, otp: string): Promise<boolean> {
  if (!isTwilioConfigured()) {
    return otp === '123456' || otp === '000000';
  }
  const formatted = formatIndianPhone(phone);
  const client = getTwilioClient();
  const serviceSid = getVerifyServiceSid();

  const verificationCheck = await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: formatted, code: otp });

  return verificationCheck.status === 'approved';
}

// Send OTP
app.post('/api/auth/send-otp', async (req: any, res: any) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    
    const outcome = await sendOtpCode(phone);
    res.json(outcome);
  } catch (err: any) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: `OTP Dispatch Failure: ${err.message}` });
  }
});

// Memory store for phones that have been verified in the last 15 minutes to prevent Twilio double-consumption failures
const recentlyVerifiedPhones = new Map<string, { timestamp: number; otp: string }>();

// Verify OTP (Direct checking helper)
app.post('/api/auth/verify-otp', async (req: any, res: any) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Mobile number and verification OTP are required' });
    }

    const isValid = await verifyOtpCode(phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'The verification code provided is invalid or expired.' });
    }

    const formatted = formatIndianPhone(phone);
    recentlyVerifiedPhones.set(formatted, { timestamp: Date.now(), otp });

    res.json({ success: true, message: 'Mobile number verified successfully' });
  } catch (err: any) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: `OTP Verification Failure: ${err.message}` });
  }
});

// Register User (with OTP verification)
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { name, phone, password, otp } = req.body;

    if (!name || !phone || !password || !otp) {
      return res.status(400).json({ error: 'Please enter all fields: Full Name, Mobile Number, Password, and OTP code.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password code must have a minimal length of 6 characters' });
    }

    const formatted = formatIndianPhone(phone);

    // Verify OTP first, allowing cached validation to secure Twilio multi-consumption
    try {
      let isValid = false;
      const cached = recentlyVerifiedPhones.get(formatted);
      if (cached && (Date.now() - cached.timestamp < 15 * 60 * 1000) && cached.otp === otp) {
        isValid = true;
      } else {
        isValid = await verifyOtpCode(phone, otp);
      }

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired SMS OTP.' });
      }
    } catch (ve: any) {
      return res.status(400).json({ error: `SMS Verification failed: ${ve.message}` });
    }

    // Check if account already exists with phone
    const existingUser = await getUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ error: 'An account already exists using this mobile number' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: any = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      name,
      phone: formatted,
      password: hashedPassword,
      role: 'user',
      blocked: false,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    const savedUser = await createUser(newUser);
    const token = generateToken(savedUser);

    res.status(201).json({
      token,
      user: savedUser
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login User (Mobile Number/Email + Password)
app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body; // 'email' holds email OR mobile number from UI login inputs

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter mobile number or email and password' });
    }

    const inputLower = email.toLowerCase();
    
    // Auto-seed admin user if they try to log in and no account exists
    if (inputLower === ADMIN_EMAIL) {
      const existingAdmin = await getUserByEmail(ADMIN_EMAIL);
      if (!existingAdmin) {
        console.log(`Auto-seeding default administrator account for ${ADMIN_EMAIL}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
        await createUser({
          id: 'admin_primary',
          name: 'System Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          blocked: false,
          addresses: [],
          createdAt: new Date().toISOString()
        });
      }
    }

    let user = null;
    // Check if input is an email address
    if (email.includes('@')) {
      user = await getUserByEmail(inputLower);
    } else {
      user = await getUserByPhone(email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials. Check mobile number or password.' });
    }

    if (user.blocked) {
      return res.status(403).json({ error: 'Your account has been suspended by an administrator' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials. Check password.' });
    }

    // Exclude password in return
    const { password: _, ...safeUser } = user;
    const token = generateToken(user);

    res.json({
      token,
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password -> Send OTP
app.post('/api/auth/forgot-password', async (req: any, res: any) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    const user = await getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ error: 'No user account exists with this mobile number.' });
    }

    const outcome = await sendOtpCode(phone);
    res.json(outcome);
  } catch (err: any) {
    console.error('Error during forgot-password OTP sending:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset Password after OTP Verify
app.post('/api/auth/reset-password', async (req: any, res: any) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: 'Mobile number, OTP digits, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await getUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ error: 'No user account exists with this mobile number.' });
    }

    // Verify OTP first
    try {
      const isValid = await verifyOtpCode(phone, otp);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP verification code.' });
      }
    } catch (ve: any) {
      return res.status(400).json({ error: `OTP Checking failed: ${ve.message}` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updateUser(user.id, { password: hashedPassword });

    res.json({ success: true, message: 'Your password code has been updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve current authenticated session
app.get('/api/auth/me', authenticateToken, (req: any, res: any) => {
  res.json({ user: req.user });
});

// Update Profile & Addresses
app.put('/api/auth/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const { name, addresses } = req.body;
    const updates: any = {};
    
    if (name) updates.name = name;
    if (addresses) updates.addresses = addresses;

    const updatedUser = await updateUser(req.user.id, updates);
    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manage Single Address Helper
app.post('/api/auth/address', authenticateToken, async (req: any, res: any) => {
  try {
    const addressData: Address = req.body;
    const user = req.user;

    const newAddress = {
      ...addressData,
      id: addressData.id || 'addr_' + Math.random().toString(36).substring(2, 11)
    };

    let addresses = [...user.addresses];
    
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }

    addresses.push(newAddress);

    // If only one address, make default
    if (addresses.length === 1) {
      addresses[0].isDefault = true;
    }

    const updatedUser = await updateUser(user.id, { addresses });
    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/auth/address/:addressId', authenticateToken, async (req: any, res: any) => {
  try {
    const { addressId } = req.params;
    const user = req.user;

    let addresses = user.addresses.filter((a: any) => a.id !== addressId);
    
    // Ensure at least one default if addresses remain
    if (addresses.length > 0 && !addresses.some((a: any) => a.isDefault)) {
      addresses[0].isDefault = true;
    }

    const updatedUser = await updateUser(user.id, { addresses });
    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- PRODUCTS & DISCOVER lifecycle ---

// Get all products, searchable & filterable
app.get('/api/products', async (req: any, res: any) => {
  try {
    const { q, category } = req.query;
    const products = await getProducts({ query: q, category });
    res.json({ products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req: any, res: any) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a product review
app.post('/api/products/:id/reviews', authenticateToken, async (req: any, res: any) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please enter rating score and comment description' });
    }

    const review: Review = {
      id: 'rev_' + Math.random().toString(36).substring(2, 11),
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    const updatedProduct = await addProductReview(productId, review);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found to review' });
    }

    res.json({ product: updatedProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- COUPONS ---
app.post('/api/coupons/apply', async (req: any, res: any) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Please enter a coupon code' });
    }

    const coupon = await getCouponByCode(code);
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ error: 'Invalid, deactivated, or expired coupon' });
    }

    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ error: 'Coupon code has expired' });
    }

    res.json({ coupon });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- CART / CHECKOUT / ORDERS ---

// Submit a new order
app.post('/api/orders', authenticateToken, async (req: any, res: any) => {
  try {
    const { items, couponCode, shippingAddress, paymentMethod, subtotal, discount, tax, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Please provide a valid shipping address' });
    }

    // Verify and deduct stock
    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const prod = await getProductById(item.productId);
      if (!prod) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${prod.name}. Only ${prod.stock} left.` });
      }
      
      orderItems.push({
        productId: item.productId,
        name: prod.name,
        image: prod.images[0] || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5',
        priceAtPurchase: prod.price * (1 - prod.discount / 100),
        quantity: item.quantity,
        color: item.selectedColor,
        storage: item.selectedStorage
      });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: orderId,
      userId: req.user.id,
      userName: req.user.name,
      items: orderItems,
      status: 'pending',
      subtotal,
      discount,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || 'Google Pay (UPI)',
      trackingNumber: `APL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      createdAt: new Date().toISOString()
    };

    const savedOrder = await createOrder(newOrder);
    res.status(201).json({ order: savedOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve customer's personal order log
app.get('/api/orders/my-orders', authenticateToken, async (req: any, res: any) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve specific order details
app.get('/api/orders/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Access control: only owner or admins may view
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access unauthorized' });
    }

    res.json({ order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel order endpoint
app.post('/api/orders/:id/cancel', authenticateToken, async (req: any, res: any) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Access control: only owner may cancel
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access unauthorized' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ error: 'Cannot cancel an order that is already delivered' });
    }

    if (order.status === 'shipped') {
      return res.status(400).json({ error: 'Cannot cancel an order that is already shipped' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    const updatedOrder = await updateOrderStatus(req.params.id, 'cancelled');
    if (!updatedOrder) {
      return res.status(500).json({ error: 'Failed to cancel order' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- SECURED ADMINISTRATOR ENDPOINTS ----------------

// Dashboard analytical data
app.get('/api/admin/stats', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const stats = await getDashboardStats();
    res.json({ stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Category fetch (public or admin)
app.get('/api/admin/categories', async (req: any, res: any) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Category creation
app.post('/api/admin/categories', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Please enter category name and description' });
    }

    const id = 'cat-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newCategory: Category = { id, name, description, slug };
    const saved = await createCategory(newCategory);
    res.status(201).json({ category: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
app.delete('/api/admin/categories/:id', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const success = await deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Products: Admin operations
app.post('/api/admin/products', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const prod: Product = req.body;
    if (!prod.name || !prod.price) {
      return res.status(400).json({ error: 'Please specify at least name and price metrics' });
    }

    const newProd = {
      ...prod,
      id: prod.id || prod.name.toLowerCase().replace(/[^a-z]/g, '-') + '-' + Math.floor(Math.random() * 1000),
      ratings: { average: 5.0, count: 0 },
      reviews: []
    };

    const saved = await createProduct(newProd);
    res.status(201).json({ product: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found to update' });
    }
    res.json({ product: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const success = await deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Users: Admin operations
app.get('/api/admin/users', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id/block', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const { blocked } = req.body;
    
    // Prevent blocking oneself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Administrative lockout suicide is restricted' });
    }

    const updated = await updateUser(req.params.id, { blocked: !!blocked });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete current administrative session' });
    }

    const success = await deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders: Admin auditing
app.get('/api/admin/orders', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const orders = await getOrders();
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const { status, trackingNumber } = req.body;
    const updated = await updateOrderStatus(req.params.id, status, trackingNumber);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Coupons: Admin auditing
app.get('/api/admin/coupons', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const coupons = await getCoupons();
    res.json({ coupons });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/coupons', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const { code, discountPercent, expiresAt } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ error: 'Please input coupon fields correctly' });
    }

    const newCoupon: Coupon = {
      code: code.toUpperCase(),
      discountPercent: Number(discountPercent),
      isActive: true,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const saved = await createCoupon(newCoupon);
    res.status(201).json({ coupon: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/coupons/:code', authenticateToken, enforceAdmin, async (req: any, res: any) => {
  try {
    const success = await deleteCoupon(req.params.code);
    if (!success) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ---------------- INITIALIZATION AND DEV BINDING ----------------

async function startServer() {
  // Connect and prepare database states
  await initDb();

  // Serving development compilation modules or production distribution builds
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static folder path
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`📡 Apple Store server listening on port ${PORT}`);
    console.log(`🖥️ Local Preview available at http://localhost:${PORT}`);
  });
}

startServer();
