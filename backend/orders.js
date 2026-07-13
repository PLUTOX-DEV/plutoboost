import express from 'express';
const router = express.Router();
import auth from './auth.js';
import { getServices } from './index.js';
import mongoose from 'mongoose';
import Order from './models/Order.js';
import User from './models/User.js';
import axios from 'axios';
import Transaction from './models/Transaction.js';

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  const { serviceId, serviceType, orderDetails, link, quantity, platform } = req.body;
  const PROFIT_MARGIN_PERCENTAGE = parseFloat(process.env.PROFIT_MARGIN_PERCENTAGE || '20');
  const KCLAUT_API_URL = process.env.KCLAUT_API_URL;
  const KCLAUT_API_KEY = process.env.KCLAUT_API_KEY;
  const KCLAUT_TEST_MODE = process.env.KCLAUT_TEST_MODE === 'true';
  const quantityValue = Math.max(1, parseInt(quantity, 10) || 1);

  if (!serviceId || !serviceType || !orderDetails) {
    return res.status(400).json({ msg: 'serviceId, serviceType, and orderDetails are required.' });
  }

  if (!KCLAUT_API_URL || !KCLAUT_API_KEY) {
    return res.status(500).json({ msg: 'KClaut provider is not configured. Please add KCLAUT_API_URL and KCLAUT_API_KEY.' });
  }

  if (quantityValue <= 0) {
    return res.status(400).json({ msg: 'Quantity must be at least 1.' });
  }

  try {
    const result = await session.withTransaction(async () => {
      const user = await User.findById(req.user.id).session(session);
      if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
      }

      const services = await getServices();
      const service = services.find(s => s.id === serviceId || s.service === String(serviceId) || s.providerId === String(serviceId));
      if (!service) {
        const err = new Error('Service not found.');
        err.status = 404;
        throw err;
      }

      const profitPercentage = PROFIT_MARGIN_PERCENTAGE / 100;
      const providerRatePerUnit = parseFloat(service.rate);
      const providerRateRaw = parseFloat(service.providerRateRaw ?? providerRatePerUnit);
      const isPerThousand = String(service.rateUnit).toLowerCase() === 'per_1000' && providerRateRaw > 0;

      let cost;
      let costPerUnit;
      if (isPerThousand) {
        cost = (quantityValue / 1000) * providerRateRaw;
        costPerUnit = providerRateRaw / 1000;
      } else {
        cost = quantityValue * providerRatePerUnit;
        costPerUnit = providerRatePerUnit;
      }

      if (!Number.isFinite(cost) || cost <= 0) {
        const err = new Error('Invalid service cost returned by provider.');
        err.status = 500;
        throw err;
      }

      const profit = cost * profitPercentage;
      const sellingPrice = cost + profit;

      console.log('\n--- Server-Side Price Calculation ---');
      console.log(`Quantity: ${quantityValue}`);
      if (isPerThousand) {
        console.log(`Provider price per 1000: ₦${providerRateRaw.toFixed(2)}`);
        console.log(`Cost (quantity / 1000 * pricePerThousand): (${quantityValue} / 1000 * ₦${providerRateRaw.toFixed(2)}) = ₦${cost.toFixed(2)}`);
        console.log(`Normalized cost per unit: ₦${costPerUnit.toFixed(6)}`);
      } else {
        console.log(`Provider cost per unit: ₦${costPerUnit.toFixed(6)}`);
        console.log(`Cost (quantity * costPerUnit): (${quantityValue} * ₦${costPerUnit.toFixed(6)}) = ₦${cost.toFixed(2)}`);
      }
      console.log(`Your Profit Margin: ${PROFIT_MARGIN_PERCENTAGE}%`);
      console.log(`Profit: ₦${profit.toFixed(2)}`);
      console.log(`Final Selling Price: ₦${sellingPrice.toFixed(2)}`);
      console.log('------------------------------------');

      if (user.balance < sellingPrice) {
        const err = new Error('Insufficient balance. Please fund your wallet.');
        err.status = 400;
        throw err;
      }

      let apiResponse;
      if (KCLAUT_TEST_MODE) {
        const fakeOrderId = Math.floor(100000 + Math.random() * 900000);
        apiResponse = { data: { order: fakeOrderId } };
        console.log(`[TEST MODE] Simulated KClaut order placement. Fake Order ID: ${fakeOrderId}`);
      } else {
        try {
          apiResponse = await axios.post(KCLAUT_API_URL, {
            key: KCLAUT_API_KEY,
            action: 'add',
            service: service.providerId,
            link: link || orderDetails,
            quantity: quantityValue,
          }, { timeout: 15000 });
        } catch (apiError) {
          console.error('KClaut API error:', apiError.message);
          const err = new Error('Provider API error. Please try again in a few moments.');
          err.status = 503;
          if (axios.isAxiosError(apiError) && apiError.response) {
            err.message = `Provider Error: ${apiError.response.data.error || 'Failed to place order.'}`;
            err.status = 400;
          }
          throw err;
        }
      }

      console.log('--- Full Response from KClaut ---');
      console.log(JSON.stringify(apiResponse.data, null, 2));
      console.log('------------------------------------');

      if (apiResponse.data && apiResponse.data.error) {
        const err = new Error(`Provider Error: ${apiResponse.data.error}`);
        err.status = 400;
        throw err;
      }

      const providerOrderId = String(apiResponse.data?.order ?? apiResponse.data?.id ?? '');
      if (!providerOrderId) {
        const err = new Error('Failed to place order with provider (Invalid Response).');
        err.status = 500;
        throw err;
      }

      user.balance -= sellingPrice;
      await user.save({ session });

      const transaction = new Transaction({
        user: user._id,
        type: 'purchase',
        amount: sellingPrice,
        description: `Order for ${serviceType}`,
      });
      await transaction.save({ session });

      const orderToSave = new Order({
        user: req.user.id,
        serviceType,
        serviceCategory: service.category || '',
        timeframe: service.type || '',
        orderDetails,
        price: sellingPrice,
        cost,
        profit,
        fee: profit, // Keep fee aligned with profit so admin reporting works
        status: 'Processing',
        link: link || orderDetails,
        quantity: quantityValue,
        platform: platform || service.category || 'General',
        provider: 'KCLAUT',
        providerOrderId,
        transaction: transaction._id,
      });
      const savedOrder = await orderToSave.save({ session });

      transaction.description = `Order for ${savedOrder.serviceType} #${savedOrder._id}`;
      await transaction.save({ session });

      try {
        const statusResp = await axios.post(KCLAUT_API_URL, {
          key: KCLAUT_API_KEY,
          action: 'status',
          order: providerOrderId,
        }, { timeout: 10000 });

        const remoteStatus = statusResp.data?.status
          || statusResp.data?.data?.status
          || (statusResp.data && statusResp.data[providerOrderId]?.status);

        if (remoteStatus) {
          savedOrder.status = remoteStatus;
          await savedOrder.save({ session });
        }
      } catch (statusErr) {
        console.warn('Immediate status check failed for provider order:', providerOrderId, statusErr.message || statusErr);
      }

      return { order: savedOrder, newBalance: user.balance };
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Order transaction error:', err.message || err);
    res.status(err.status || 500).json({ msg: err.message || 'Server Error' });
  } finally {
    await session.endSession();
  }
});

// @route   GET api/orders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ msg: 'No orders found for this user' });
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/orders/status
// @desc    Check status of multiple orders
// @access  Private
router.post('/status', auth, async (req, res) => {
  const { providerOrderIds } = req.body;
  if (!providerOrderIds || !Array.isArray(providerOrderIds) || providerOrderIds.length === 0) {
    return res.status(400).json({ msg: 'An array of providerOrderIds is required.' });
  }

  const KCLAUT_API_URL = process.env.KCLAUT_API_URL;
  const KCLAUT_API_KEY = process.env.KCLAUT_API_KEY;

  if (!KCLAUT_API_URL || !KCLAUT_API_KEY) {
    return res.status(500).json({ msg: 'KClaut provider is not configured. Please add KCLAUT_API_URL and KCLAUT_API_KEY.' });
  }

  try {
    const statusResponse = await axios.post(KCLAUT_API_URL, {
      key: KCLAUT_API_KEY,
      action: 'statusorders',
      orders: providerOrderIds.join(','),
    });

    const bulkOps = [];
    for (const providerOrderId of providerOrderIds) {
      const rawStatus = statusResponse.data?.[providerOrderId];
      const remoteStatus = rawStatus?.status || (typeof rawStatus === 'string' ? rawStatus : null);
      if (remoteStatus) {
        bulkOps.push({
          updateOne: {
            filter: { providerOrderId, user: req.user.id },
            update: { $set: { status: remoteStatus } }
          }
        });
      }
    }

    if (bulkOps.length > 0) {
      await Order.bulkWrite(bulkOps);
    }

    res.json({ success: true, message: 'Statuses updated.' });
  } catch (err) {
    console.error('Order status check error:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
