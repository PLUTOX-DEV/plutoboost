import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import { sendEmail } from './mailer.js';
import { createLog } from './logger.js';

dotenv.config();

const {
  EXOBOOSTER_API_URL,
  EXO_API_KEY,
  LOW_BALANCE_THRESHOLD,
  ADMIN_EMAIL
} = process.env;

// Support multiple admin recipients via ADMIN_EMAILS (comma-separated) or single ADMIN_EMAIL
const ADMIN_RECIPIENTS = (process.env.ADMIN_EMAILS || ADMIN_EMAIL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .join(',');

let isAlertSent = false; // Flag to prevent sending multiple alerts

export async function checkBalanceAndNotify() {
  await createLog('info', 'Checking Exo Booster balance...', 'watchdog');

  try {
    const response = await axios.post(EXOBOOSTER_API_URL, {
      key: EXO_API_KEY,
      action: 'balance'
    });

    if (response.data && response.data.balance != null) {
      const balance = parseFloat(response.data.balance);
      const threshold = parseFloat(LOW_BALANCE_THRESHOLD);

      await createLog('info', `Current provider balance: ${response.data.currency} ${balance}`, 'watchdog');

      if (balance < threshold) {
        if (!isAlertSent) {
          await createLog('warning', `Balance is below threshold! Sending email alert.`, 'watchdog');
          const subject = '🚨 PlutoBoost Alert: Low Provider Balance';
          const html = `
            <h1>Low Balance Warning</h1>
            <p>Your Exo Booster balance is low: <strong>${response.data.currency} ${balance}</strong>.</p>
            <p>The threshold is set to ${response.data.currency} ${threshold}.</p>
            <p>Please add funds to your provider account to avoid service interruptions.</p>
          `;
          // Send to all configured admin recipients
          await sendEmail(ADMIN_RECIPIENTS || ADMIN_EMAIL, subject, html);
          isAlertSent = true; // Set flag to true after sending
        } else {
          await createLog('info', 'Low balance alert already sent. Skipping.', 'watchdog');
        }
      } else {
        isAlertSent = false; // Reset the flag if the balance is back to normal
      }
    } else {
      await createLog('error', 'Invalid balance response from provider.', 'watchdog');
    }
  } catch (err) {
    console.error('[Watchdog] Failed to check Exo Booster balance:', err.message);
  }
}

export async function sendDailyReport() {
  await createLog('info', 'Generating and sending daily report...', 'watchdog');
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const newUsers = await User.countDocuments({ createdAt: { $gte: yesterday } });
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: yesterday } });
    const completedOrders = await Order.countDocuments({ createdAt: { $gte: yesterday }, status: 'Completed' });
    
    const revenueResult = await Order.aggregate([
      { $match: { createdAt: { $gte: yesterday }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$fee' } } }
    ]);
    const dailyRevenue = revenueResult[0]?.total || 0;

    const subject = `PlutoBoost Daily Report - ${today.toLocaleDateString()}`;
    const html = `
      <h1>PlutoBoost Daily Status Report</h1>
      <p>Here are the stats for ${yesterday.toLocaleDateString()}:</p>
      <ul>
        <li><strong>New Users:</strong> ${newUsers}</li>
        <li><strong>Total Orders Placed:</strong> ${totalOrders}</li>
        <li><strong>Completed Orders:</strong> ${completedOrders}</li>
        <li><strong>Total Profit:</strong> ₦${dailyRevenue.toLocaleString()}</li>
      </ul>
      <p>Have a great day!</p>
    `;

    await sendEmail(ADMIN_RECIPIENTS || ADMIN_EMAIL, subject, html);
  } catch (err) {
    await createLog('error', `Failed to send daily report: ${err.message}`, 'watchdog');
  }
}

export async function updateOrderStatuses() {
  await createLog('info', 'Checking for active order status updates...', 'watchdog');
  try {
    // Find orders that are not in a final state
    const activeOrders = await Order.find({
      status: { $in: ['Processing', 'Pending', 'In progress'] },
      providerOrderId: { $exists: true, $ne: null }
    });

    if (activeOrders.length === 0) {
      await createLog('info', 'No active orders to update.', 'watchdog');
      return;
    }

    const providerOrderIds = activeOrders.map(o => o.providerOrderId);

    const statusResponse = await axios.post(EXOBOOSTER_API_URL, {
      key: EXO_API_KEY,
      action: 'status',
      orders: providerOrderIds.join(','),
    });

    const bulkOps = [];
    for (const providerOrderId in statusResponse.data) {
      const remoteStatus = statusResponse.data[providerOrderId];
      if (remoteStatus && remoteStatus.status) {
        bulkOps.push({
          updateOne: {
            filter: { providerOrderId: providerOrderId },
            update: { $set: { status: remoteStatus.status } }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      await Order.bulkWrite(bulkOps);
      await createLog('info', `Updated status for ${bulkOps.length} orders.`, 'watchdog');
    }
  } catch (err) {
    await createLog('error', `Failed to update order statuses: ${err.message}`, 'watchdog');
  }
}