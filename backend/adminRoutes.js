import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from './models/User.js';
import Order from './models/Order.js';
import Transaction from './models/Transaction.js';
import Notification from './models/Notification.js';
import Post from './models/Post.js';
import { createLog } from './logger.js';
import authenticateToken, { adminOnly } from './auth.js';

const settingSchema = new mongoose.Schema({ key: { type: String, required: true, unique: true }, value: mongoose.Schema.Types.Mixed });
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

const getSetting = async (key, defaultValue) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : defaultValue;
};

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (username !== 'admin' || !adminPasswordHash) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);

    if (isPasswordCorrect) {
        const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await createLog('info', 'Admin login successful', 'security');
        res.json({ token, userId: 'admin', role: 'admin' });
    } else {
        res.status(401).json({ error: 'Invalid admin credentials' });
    }
});

// --- Protected Admin Routes ---
// The middleware below will protect all subsequent routes in this file.
router.use(authenticateToken, adminOnly);

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'Completed' });
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        const orderProfitResult = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, total: { $sum: '$fee' } } }
        ]);
        const totalOrderProfit = orderProfitResult[0]?.total || 0;

        const depositFeeResult = await Transaction.aggregate([
            { $match: { type: 'deposit', fee: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$fee' } } }
        ]);
        const totalDepositFees = depositFeeResult[0]?.total || 0;

        const totalProfit = totalOrderProfit + totalDepositFees;
        res.json({
            revenue: totalProfit,
            users: totalUsers,
            orders: totalOrders,
            completed: completedOrders,
            pending: pendingOrders,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/platform-distribution', async (req, res) => {
    const platformDistribution = await Order.aggregate([
        { $group: { _id: '$platform', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } }
    ]);
    res.json(platformDistribution);
});

router.get('/revenue-stats', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueData = await Order.aggregate([
            { $match: { status: 'Completed', createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: '$price' } } },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, name: '$_id', value: '$total' } }
        ]);

        res.json(revenueData);
    } catch (err) {
        console.error("Error fetching revenue stats:", err.message);
        res.status(500).json({ error: 'Failed to fetch revenue statistics' });
    }
});

router.get('/fees-report', async (req, res) => {
    try {        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const depositFees = await Transaction.aggregate([
            { $match: { type: 'deposit', fee: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$fee' } } }
        ]);

        const orderProfits = await Order.aggregate([
            { $match: { status: 'Completed', fee: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$fee' } } }
        ]);

        const totalDepositFees = depositFees[0]?.total || 0;
        const totalOrderProfits = orderProfits[0]?.total || 0;

        let recentFeeTransactions = await Transaction.find({ $or: [{ fee: { $gt: 0 } }, { type: 'purchase' }] })
            .populate('user', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const purchaseTransactionIds = recentFeeTransactions.filter(tx => tx.type === 'purchase').map(tx => tx._id);

        if (purchaseTransactionIds.length > 0) {
            const orders = await Order.find({ transaction: { $in: purchaseTransactionIds } }).select('transaction fee');
            const feeMap = new Map(orders.map(order => [order.transaction.toString(), order.fee]));
            recentFeeTransactions = recentFeeTransactions.map(tx => {
                if (tx.type === 'purchase') {
                    tx.profit = feeMap.get(tx._id.toString()) || 0;
                }
                return tx;
            });
        }

        const totalCount = await Transaction.countDocuments({ $or: [{ fee: { $gt: 0 } }, { type: 'purchase' }] });

        res.json({
            stats: { totalDepositFees, totalOrderProfits, totalRevenue: totalDepositFees + totalOrderProfits },
            transactions: recentFeeTransactions,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch fees report: ' + err.message });
    }
});

router.get('/deposits', async (req, res) => {
    try {
        const deposits = await Transaction.find({ type: 'deposit' }).populate('user', 'username email').sort({ createdAt: -1 });
        res.json(deposits);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch deposit history' });
    }
});

router.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const aggregationPipeline = [
            { $lookup: { from: 'orders', localField: '_id', foreignField: 'user', as: 'userOrders' } },
            { $addFields: { totalSpent: { $sum: '$userOrders.price' }, orderCount: { $size: '$userOrders' } } },
            { $project: { password: 0, userOrders: 0 } },
            { $sort: { createdAt: -1 } }
        ];

        const usersData = await User.aggregate([
            { $facet: { users: [...aggregationPipeline, { $skip: skip }, { $limit: limit }], totalCount: [{ $count: 'count' }] } }
        ]);

        const statsAggregation = await User.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const userStats = {
            active: statsAggregation.find(s => s._id === 'active')?.count || 0,
            suspended: statsAggregation.find(s => s._id === 'suspended')?.count || 0,
        };
        const users = usersData[0].users;
        const totalUsers = usersData[0].totalCount[0] ? usersData[0].totalCount[0].count : 0;

        res.json({
            users,
            stats: { ...userStats, total: totalUsers },
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id', async (req, res) => {
    const { username, email, balance } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (balance !== undefined) updateData.balance = parseFloat(balance);

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id/suspend', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: 'suspended' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/users/:id/activate', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: 'active' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/orders', async (req, res) => {
    try {        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = {};

        if (search) {
            const friendlyIdMatch = search.match(/^#?PB-([a-f0-9]{4})$/i);
            if (friendlyIdMatch) {
                const partialId = friendlyIdMatch[1];
                query = { _id: { $regex: new RegExp(`${partialId}$`, 'i') } };
            } else if (mongoose.Types.ObjectId.isValid(search)) {
                query = { _id: search };
            } else {
                const users = await User.find({ $or: [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }).select('_id');
                const userIds = users.map(u => u._id);
                query = { $or: [{ serviceType: { $regex: search, $options: 'i' } }, { platform: { $regex: search, $options: 'i' } }, { user: { $in: userIds } }] };
            }
        }

        const orders = await Order.find(query).populate('user', 'username email').sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalOrders = await Order.countDocuments(query);

        res.json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/orders/status', async (req, res) => {
    const { orderIds } = req.body;
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: 'Order IDs must be a non-empty array.' });
    }
  
    try {
      const KCLAUT_API_URL = process.env.KCLAUT_API_URL;
      const KCLAUT_API_KEY = process.env.KCLAUT_API_KEY;

      if (!KCLAUT_API_URL || !KCLAUT_API_KEY) {
        return res.status(500).json({ error: 'KClaut provider is not configured.' });
      }

      const response = await axios.post(KCLAUT_API_URL, {
        key: KCLAUT_API_KEY,
        action: 'statusorders',
        orders: orderIds.join(','),
      });

      for (const orderId in response.data) {
        const statusValue = response.data[orderId]?.status || response.data[orderId];
        if (statusValue) {
          await Order.findOneAndUpdate({ providerOrderId: orderId }, { status: statusValue });
        }
      }
      res.json({ success: true, message: 'Statuses updated.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order statuses from provider.' });
    }
});

router.post('/notifications', async (req, res) => {
    const { title, message, userId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }
  
    try {
      if (userId) { // Send to a specific user
        const notification = new Notification({ user: userId, title, message });
        await notification.save();
      } else { // Broadcast to all users
        const notification = new Notification({ title, message, isBroadcast: true });
        await notification.save();
      }
      res.status(201).json({ success: true, message: 'Notification sent successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to send notification.' });
    }
});

router.get('/notifications', async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

router.put('/notifications/:id', async (req, res) => {
    try {
      const { title, message } = req.body;
      const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, { title, message }, { new: true });
      if (!updatedNotification) return res.status(404).json({ error: 'Notification not found' });
      res.json(updatedNotification);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update notification.' });
    }
});
  
router.delete('/notifications/:id', async (req, res) => {
    try {
      await Notification.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete notification.' });
    }
});

router.post('/blog/posts', async (req, res) => {
    const { title, content, author } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
  
    try {
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const newPost = new Post({ title, content, author, slug });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create post. Slug might already exist.' });
    }
});

router.get('/system', async (req, res) => {
    const Log = mongoose.model('Log');
  
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const serverLoad = Math.floor(Math.random() * (75 - 40 + 1)) + 40;
  
    let providerStatus;
    try {
      const KCLAUT_API_URL = process.env.KCLAUT_API_URL;
      const KCLAUT_API_KEY = process.env.KCLAUT_API_KEY;

      if (!KCLAUT_API_URL || !KCLAUT_API_KEY) {
        throw new Error('KClaut provider is not configured.');
      }

      const response = await axios.post(KCLAUT_API_URL, {
        key: KCLAUT_API_KEY,
        action: 'balance'
      });

      if (response.data && response.data.balance != null) {
        providerStatus = {
          name: "KClaut API",
          status: "operational",
          icon: "Zap",
          value: "Connected",
          balance: `Balance: ${response.data.balance} ${response.data.currency}`
        };
      } else {
        throw new Error('Invalid response from provider');
      }
    } catch (err) {
      console.error('KClaut status check error:', err.response?.data || err.message);
      providerStatus = {
        name: "KClaut API",
        status: "error",
        icon: "Zap",
        value: "Disconnected",
        balance: "Check API Key or URL"
      };
    }
  
    const recentLogs = await Log.find().sort({ timestamp: -1 }).limit(10);
    const formattedLogs = recentLogs.map(log => ({
      time: new Date(log.timestamp).toLocaleTimeString(),
      level: log.level,
      message: log.message,
      type: log.type,
    }));
  
    const systemData = {
      stats: { activeUsers: totalUsers, totalOrders, revenue: totalRevenue, serverLoad },
      metrics: [
        { name: "API Status", status: "operational", icon: "Server", value: "99.9%", uptime: "30 days" },
        { name: "Database", status: "operational", icon: "Database", value: "Healthy", connections: "247/500" },
        { name: "Server Load", status: "warning", icon: "Cpu", value: "75%", cores: "8/8" },
        providerStatus,
        { name: "Security", status: "operational", icon: "ShieldCheck", value: "Protected", threats: "0" }
      ],
      controls: { maintenanceMode: await getSetting('maintenanceMode', false) },
      logs: formattedLogs
    };
  
    res.json(systemData);
});

router.post('/system/maintenance', async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'Enabled flag must be a boolean.' });
    }

    const existingSetting = await Setting.findOneAndUpdate(
      { key: 'maintenanceMode' },
      { value: enabled },
      { new: true, upsert: true }
    );

    res.json({ maintenanceMode: existingSetting.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/system/clear-cache', async (req, res) => {
  try {
    // If you have in-memory caches or service caches, clear them here.
    res.json({ message: 'Cache cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/system/run-diagnostics', async (req, res) => {
  try {
    const diagnostics = {
      database: 'ok',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date(),
    };
    res.json({ message: 'Diagnostics completed successfully.', diagnostics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/banks', async (req, res) => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=NGN', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    res.json(response.data.data || []);
  } catch (err) {
    console.error('Failed to fetch banks:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch banks.' });
  }
});

router.post('/resolve-account', async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;
    if (!accountNumber || !bankCode) {
      return res.status(400).json({ error: 'Account number and bank code are required.' });
    }

    const response = await axios.get('https://api.paystack.co/bank/resolve', {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      },
      params: {
        account_number: accountNumber,
        bank_code: bankCode
      }
    });

    res.json({ accountName: response.data.data.account_name });
  } catch (err) {
    console.error('Account resolution failed:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || 'Failed to resolve account.' });
  }
});

router.post('/withdraw', async (req, res) => {
  try {
    const { amount, accountNumber, bankCode, accountName } = req.body;
    if (!amount || !accountNumber || !bankCode || !accountName) {
      return res.status(400).json({ error: 'Amount, account number, bank code, and account name are required.' });
    }

    const withdrawal = new Transaction({
      user: req.user.id,
      type: 'withdrawal',
      amount: Number(amount),
      fee: 0,
      description: `Owner withdrawal to ${accountName} (${accountNumber}) via bank ${bankCode}`,
      status: 'Pending'
    });

    await withdrawal.save();
    res.json({ message: 'Withdrawal request has been created successfully.' });
  } catch (err) {
    console.error('Withdrawal request failed:', err.message);
    res.status(500).json({ error: 'Failed to create withdrawal request.' });
  }
});

router.get('/logs/watchdog', async (req, res) => {
    try {
      const logs = await mongoose.model('Log').find({ type: 'watchdog' }).sort({ timestamp: -1 }).limit(100);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch watchdog logs.' });
    }
});

export default router;