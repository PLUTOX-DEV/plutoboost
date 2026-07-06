import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import helmet from 'helmet';
import axios from 'axios';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import Order from './models/Order.js';
import Transaction from './models/Transaction.js'; // Import Transaction model
import orderRoutes from './orders.js';
import Post from './models/Post.js';
import Notification from './models/Notification.js';// Keep this for existing notifications
import { createLog } from './logger.js';
import { sendEmail } from './mailer.js';

import adminRoutes from './adminRoutes.js';
dotenv.config();

// Startup validation for essential environment variables
if (!process.env.EXOBOOSTER_API_URL || !process.env.EXO_API_KEY) {
  console.error("FATAL ERROR: Missing EXOBOOSTER_API_URL or EXO_API_KEY in .env file.");
  process.exit(1);
}

// --- Vercel-Ready State Management ---
// Create a simple model to store system settings like maintenance mode
const settingSchema = new Schema({ key: { type: String, required: true, unique: true }, value: Schema.Types.Mixed });
let Setting;
try {
  Setting = mongoose.model('Setting', settingSchema);
} catch (err) {
  if (err.name === 'OverwriteModelError') {
    Setting = mongoose.model('Setting');
  } else {
    throw err;
  }
}

// Helper to get a setting from the DB
async function getSetting(key, defaultValue) {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
}

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(helmet()); // Adds important security headers
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Maintenance mode middleware
app.use(async (req, res, next) => {
  const maintenanceMode = await getSetting('maintenanceMode', false);
  // Allow access to admin and login routes
  if (maintenanceMode && !req.path.startsWith('/api/admin') && !req.path.includes('/login')) {
    return res.status(503).json({ error: 'Site is currently under maintenance.' });
  }
  next();
});


// Passport strategies
import('./passport-config.js').then(({ default: configurePassport }) => {
  configurePassport(passport);
});

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
});

app.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

// Auth middleware
import authenticateToken from './auth.js';

// Register new user - FIXED: Plain-text password is sent to .save(), letting User.js handle hashing once.
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  // Validation
  if (!normalizedUsername || !normalizedEmail || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    const user = new User({ username: normalizedUsername, email: normalizedEmail, password, balance: 0 });
    await user.save();
    await createLog('info', `New user registration: ${email}`, 'user');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userResponse = { id: user._id, username: user.username, email: user.email };
    res.json({ token, user: userResponse, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login existing user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const loginIdentifier = username?.trim();
  const normalizedEmail = username?.trim().toLowerCase();
  try {
    const user = await User.findOne({
      $or: [
        { username: loginIdentifier },
        { email: normalizedEmail }
      ]
    });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await createLog('info', `User login: ${username}`, 'security');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userResponse = { id: user._id, username: user.username, email: user.email };
    res.json({ token, user: userResponse, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({ balance: user.balance, user: { id: user._id, username: user.username, email: user.email } });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/wallet/fund', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.balance += amount;
      await user.save();
      await createLog('info', `Wallet funded for ${user.username} with ₦${amount}`, 'payment');
      res.json({ success: true, newBalance: user.balance });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate if userId is a valid ObjectId before using it in aggregation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // General Stats
    const totalOrders = await Order.countDocuments({ user: userId });
    const completedOrders = await Order.find({ user: userId, status: 'Completed' });

    const totalSpent = completedOrders.reduce((sum, order) => sum + order.price, 0);
    const totalFollowers = completedOrders
      .filter(o => o.serviceType.toLowerCase().includes('follower'))
      .reduce((sum, order) => sum + (order.quantity || 0), 0);
    const avgPerOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Recent Activity
    const recentOrders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(4);
    const recentActivity = recentOrders.map(order => ({
      type: 'order',
      platform: order.platform,
      service: order.serviceType,
      qty: order.quantity,
      time: order.createdAt,
    }));

    // Top Services
    const topServices = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$serviceType', orders: { $sum: 1 }, revenue: { $sum: '$price' } } },
      { $sort: { revenue: -1 } },
      { $limit: 4 },
      { $project: { _id: 0, name: '$_id', orders: 1, revenue: 1 } }
    ]);

    // Platform Distribution
    const platformDistribution = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'Completed' } },
      { $group: { _id: '$platform', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } }
    ]);

    res.json({
      stats: {
        totalEarnings: totalSpent,
        followersPurchased: totalFollowers,
        totalOrders: totalOrders,
        avgPerOrder: avgPerOrder,
      },
      recentActivity,
      topServices,
      platformDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Transaction.countDocuments({ user: req.user.id });

    res.json({
      transactions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let servicesCache = {
  data: null,
  lastFetched: null,
};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function getServices() {
  const now = Date.now();
  if (servicesCache.data && (now - servicesCache.lastFetched < CACHE_DURATION_MS)) {
    return servicesCache.data;
  }

  const response = await axios.post(process.env.EXOBOOSTER_API_URL, {
    key: process.env.EXO_API_KEY,
    action: 'services',
  });

  const services = response.data.map(service => ({
    ...service,
    platform: service.category.toLowerCase().split(' ')[0],
  }));

  servicesCache = { data: services, lastFetched: now };
  return services;
}

app.get('/services', async (req, res) => {
  try {
    const PROFIT_MARGIN_PERCENTAGE = process.env.PROFIT_MARGIN_PERCENTAGE || 20; // Default to 20%
    const { platform } = req.query;
    let allServices = await getServices();

    // Log raw prices from Exo Booster for debugging, as requested.
    console.log("--- Raw Exo Booster Prices (per 1k) ---");
    allServices.forEach(s => console.log(`ID: ${s.service} | ${s.name}: ₦${s.rate}`));
    console.log("-----------------------------------------");

    // Apply profit margin to create the final selling price
    allServices = allServices.map(service => ({
      ...service,
      price: parseFloat(service.rate) * (1 + (PROFIT_MARGIN_PERCENTAGE / 100))
    }));

    if (platform) {
      allServices = allServices.filter(s => s.category.toLowerCase().includes(platform.toLowerCase()));
    }

    res.json(allServices);
  } catch (err) {
    console.error("Error fetching services from provider:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/user/orders', authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { user: req.user.id };

    if (search) {
      const friendlyIdMatch = search.match(/^#?PB-([a-f0-9]{4})$/i);

      if (friendlyIdMatch) {
        const partialId = friendlyIdMatch[1];
        query._id = { $regex: new RegExp(`${partialId}$`, 'i') };
      } else if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      } else {
        query.$or = [
          { serviceType: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { platform: { $regex: search, $options: 'i' } }
        ];
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// The admin router will handle its own internal authentication,
// keeping the login route public and protecting all others.
app.use('/api/admin', adminRoutes);

app.get('/api/blog/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
});

app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Fetch all notifications specifically for the user
    const userNotifications = await Notification.find({ user: userId });

    // Fetch all broadcast notifications
    const broadcastNotifications = await Notification.find({ isBroadcast: true });

    // Combine and mark broadcasts as read if the user is in the readBy array
    const allNotifications = [
        ...userNotifications.map(n => n.toObject()),
        ...broadcastNotifications.map(n => ({ ...n.toObject(), read: Array.isArray(n.readBy) ? n.readBy.some(id => id.equals(userId)) : false }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allNotifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

app.post('/api/notifications/read/all', authenticateToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Mark all of the user's specific notifications as read
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
    // Add the user to the `readBy` array for all broadcast notifications
    await Notification.updateMany({ isBroadcast: true }, { $addToSet: { readBy: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all notifications as read.' });
  }
});

app.post('/api/notifications/read', authenticateToken, async (req, res) => {
  const { ids } = req.body;
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Mark specific notifications as read for the user
    await Notification.updateMany({ _id: { $in: ids }, user: userId }, { $set: { read: true } });
    // Also handle marking a specific broadcast as read by this user
    await Notification.updateMany({ _id: { $in: ids }, isBroadcast: true }, { $addToSet: { readBy: userId } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notifications as read.' });
  }
});

app.get('/api/user/referral-code', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.referralCode) {
      user.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      await user.save();
    }
    res.json({ referralCode: user.referralCode });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get referral code.' });
  }
});

// --- Vercel Cron Job Endpoints ---
// A secret key to ensure only Vercel can trigger these jobs
const CRON_SECRET = process.env.CRON_SECRET || 'your-default-cron-secret';

const checkCronSecret = (req, res, next) => {
  if (req.headers['authorization'] !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const { checkBalanceAndNotify, sendDailyReport, updateOrderStatuses } = await import('./watchdog.js');

app.post('/api/cron/check-balance', checkCronSecret, async (req, res) => { await checkBalanceAndNotify(); res.status(200).send('OK'); });
app.post('/api/cron/daily-report', checkCronSecret, async (req, res) => { await sendDailyReport(); res.status(200).send('OK'); });
app.post('/api/cron/update-orders', checkCronSecret, async (req, res) => { await updateOrderStatuses(); res.status(200).send('OK'); });

app.post('/api/contact', async (req, res) => {
  // Public contact form - no authentication needed
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  console.log(`
    New Public Contact Form Submission:
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    Message: ${message}
  `);

  await createLog('info', `New public contact message from ${email}: ${subject}`, 'support');

  // Send email notification to admin
  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;
  await sendEmail(process.env.ADMIN_EMAIL, `New Contact Message: ${subject}`, emailHtml);

  res.json({ success: true, message: 'Your message has been sent. We will get back to you shortly.' });
});

app.post('/api/help/contact', authenticateToken, async (req, res) => {
  // Authenticated user help form
  const { subject, message } = req.body;
  const user = await User.findById(req.user.id);

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required.' });
  }

  console.log(`
    New Authenticated Support Ticket:
    User: ${user.username} (${user.email})
    User ID: ${user._id}
    Subject: ${subject}
    Message: ${message}
  `);

  await createLog('info', `New support ticket from ${user.email}: ${subject}`, 'support');
  res.json({ success: true, message: 'Your message has been sent. We will get back to you shortly.' });
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

app.put('/api/user/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if the user exists or not
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent. Please check your inbox and spam folder.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste it into your browser to complete the process:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    await sendEmail(user.email, 'PlutoBoost Password Reset', emailHtml);
    res.json({ message: 'If an account with this email exists, a password reset link has been sent. Please check your inbox and spam folder.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

app.post('/paystack/initialize', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: user.email,
      amount: amount * 100, // Convert to kobo
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/wallet`,
      metadata: { userId: user._id }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ url: response.data.data.authorization_url, reference: response.data.data.reference });
  } catch (err) {
    console.error('Paystack error:', err.response?.data);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

app.post('/paystack/verify', authenticateToken, async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    return res.status(400).json({ error: 'Payment reference is required' });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    const { status, amount, metadata } = response.data.data;

    if (status === 'success' && metadata.userId === req.user.id) {
      const DEPOSIT_FEE_PERCENTAGE = process.env.DEPOSIT_FEE_PERCENTAGE || 2.5;
      const depositedAmount = amount / 100;
      const fee = depositedAmount * (DEPOSIT_FEE_PERCENTAGE / 100);
      const finalAmount = depositedAmount - fee;

      const user = await User.findById(req.user.id);
      user.balance += finalAmount;

      const transaction = new Transaction({
        user: user._id,
        type: 'deposit',
        amount: finalAmount,
        fee: fee,
        description: `Wallet funding of ₦${depositedAmount.toLocaleString()} via Paystack (ref: ${reference})`,
      });
      await transaction.save();
      await user.save();

      return res.json({ success: true, newBalance: user.balance, message: 'Wallet funded successfully!' });
    } else {
      return res.status(400).json({ error: 'Payment verification failed or reference mismatch.' });
    }
  } catch (err) {
    console.error('Paystack verification error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

app.post('/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    await createLog('error', 'Invalid Paystack webhook signature received.', 'security');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  if (event.event !== 'charge.success') {
    return res.sendStatus(200);
  }

  const { reference } = event.data;

  const existingTransaction = await Transaction.findOne({ description: { $regex: reference } });
  if (existingTransaction) {
    return res.status(200).send('Transaction already processed');
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      });

      const { status, amount, metadata } = response.data.data;
      const userId = metadata?.userId;

      if (status !== 'success' || !userId) {
        await createLog('warning', `Webhook for ref ${reference} failed verification. Status: ${status}`, 'payment');
        return;
      }

      const user = await User.findById(userId).session(session);
      if (!user) {
        await createLog('error', `Webhook for ref ${reference}: User with ID ${userId} not found.`, 'payment');
        return;
      }

      const DEPOSIT_FEE_PERCENTAGE = process.env.DEPOSIT_FEE_PERCENTAGE || 2.5;
      const depositedAmount = amount / 100;
      const fee = depositedAmount * (DEPOSIT_FEE_PERCENTAGE / 100);
      const finalAmount = depositedAmount - fee;

      user.balance += finalAmount;

      const transaction = new Transaction({
        user: user._id,
        type: 'deposit',
        amount: finalAmount,
        fee: fee,
        description: `Wallet funding of ₦${depositedAmount.toLocaleString()} via Paystack (ref: ${reference})`,
      });
      await transaction.save({ session });
      await user.save({ session });
      await createLog('info', `Webhook for ref ${reference}: Credited ₦${finalAmount} to user ${user.email}`, 'payment');
    });

    res.sendStatus(200);

  } catch (err) {
    console.error('Paystack webhook processing error:', err.response?.data || err.message);
    res.status(500).send('Internal Server Error');
  } finally {
    await session.endSession();
  }
});

// Use the consolidated order routes
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // Keep trying to select a server for 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}).then(() => {
  console.log('MongoDB connected successfully.');

  // Start the HTTP server unless running on Vercel (serverless)
  // Use `PORT` env var when provided (Elastic Beanstalk / Docker / PXXL)
  const PORT = process.env.PORT || 5000;
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Backend running on http://0.0.0.0:${PORT}`);
    });
  } else {
    console.log('Detected Vercel environment; skipping explicit app.listen().');
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to the DB
});

// Lightweight health endpoint for uptime / readiness checks
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
});

// Export the app for Vercel
export default app;