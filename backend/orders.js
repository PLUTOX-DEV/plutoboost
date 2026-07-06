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
  const { serviceId, serviceType, orderDetails, price, link, quantity, platform } = req.body;
  const PROFIT_MARGIN_PERCENTAGE = process.env.PROFIT_MARGIN_PERCENTAGE || 20; // Default to 20%

  try {
    const result = await session.withTransaction(async () => {
      const user = await User.findById(req.user.id).session(session);
      if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
      }

      // --- Recalculate price on the backend to ensure correctness ---
      const services = await getServices();
      const service = services.find(s => s.service === serviceId);
      if (!service) {
        const err = new Error('Service not found.');
        err.status = 404;
        throw err;
      }

      // Corrected: Recalculate price on backend based on per-unit cost to ensure accuracy
      const costPerUnit = parseFloat(service.rate);
      const cost = quantity * costPerUnit;
      const profitPercentage = PROFIT_MARGIN_PERCENTAGE / 100;
      const sellingPricePerUnit = costPerUnit * (1 + profitPercentage);
      const sellingPrice = quantity * sellingPricePerUnit;
      const profit = sellingPrice - cost;

      console.log("\n--- Server-Side Price Calculation ---");
      console.log(`Quantity: ${quantity}`);
      console.log(`Provider Cost (per unit): ₦${costPerUnit.toFixed(2)}`);
      console.log(`Total Cost from Provider: (${quantity} * ₦${costPerUnit.toFixed(2)}) = ₦${cost.toFixed(2)}`);
      console.log(`Your Profit Margin: ${PROFIT_MARGIN_PERCENTAGE}%`);
      console.log(`Final Selling Price: (₦${cost.toFixed(2)} * (1 + ${profitPercentage})) = ₦${sellingPrice.toFixed(2)}`);
      console.log(`Your Profit on this Order: ₦${profit.toFixed(2)}`);
      console.log("------------------------------------");

      if (user.balance < sellingPrice) {
        const err = new Error('Insufficient balance. Please fund your wallet.');
        err.status = 400;
        throw err;
      }

    // Call external API before saving and charging user
    let apiResponse;
    if (process.env.EXOBOOSTER_TEST_MODE === 'true') {
      // Simulate a successful API response in test mode
      const fakeOrderId = Math.floor(100000 + Math.random() * 900000);
      apiResponse = { data: { order: fakeOrderId } };
      console.log(`[TEST MODE] Simulated ExoBooster order placement. Fake Order ID: ${fakeOrderId}`);
    } else {
      try {
        apiResponse = await axios.post(process.env.EXOBOOSTER_API_URL, {
          key: process.env.EXO_API_KEY,
          action: 'add',
          service: serviceId,
          quantity: quantity || 1,
          link: link || orderDetails,
        }, { timeout: 15000 }); // Add a 15-second timeout for the provider API
      } catch (apiError) {
        console.error('ExoBooster API error:', apiError.message);
        const err = new Error('Provider API error. Please try again in a few moments.');
        err.status = 503; // Service Unavailable is a good code here.

        if (axios.isAxiosError(apiError) && apiError.response) {
          // If the provider API responded with an error (e.g. "invalid link")
          err.message = `Provider Error: ${apiError.response.data.error || 'Failed to place order.'}`;
          err.status = 400; // Bad Request from our client's side
        }
        throw err;
      }
    }

    console.log("--- Full Response from Exo Booster ---");
    console.log(JSON.stringify(apiResponse.data, null, 2));
    console.log("------------------------------------");

    // Check for an error message in the provider's response body
    if (apiResponse.data && apiResponse.data.error) {
      const err = new Error(`Provider Error: ${apiResponse.data.error}`);
      err.status = 400; // Bad Request, as the issue is with the order itself (e.g., funds)
      throw err;
    }

    const providerOrderId = apiResponse.data.order || apiResponse.data.id;
    if (!apiResponse || !apiResponse.data || !providerOrderId) {
      const err = new Error('Failed to place order with provider (Invalid Response).');
      err.status = 500;
      throw err;
    }

    // If API call was successful, now deduct balance and save order
      user.balance -= sellingPrice;
      await user.save({ session });

    // Create a transaction for the purchase
    const transaction = new Transaction({
      user: user._id,
      type: 'purchase',
        amount: sellingPrice, // Record the full amount deducted
      description: `Order for ${serviceType}`, // Temp description
    });
      await transaction.save({ session });

      // Create and save the order, linking it to the transaction
      const orderToSave = new Order({
        user: req.user.id,
        serviceType,
        orderDetails,
        price: sellingPrice,
        cost: cost,
        profit: profit, // Ensure profit is saved with the order
        fee: profit, // Explicitly save the calculated profit as a fee on the order
        status: 'Processing',
        link: link || orderDetails,
        quantity: quantity || 1,
        platform: platform || 'General',
        providerOrderId: providerOrderId,
        transaction: transaction._id // Link to the transaction
      });
      const savedOrder = await orderToSave.save({ session });

      // Now update the transaction description with the final Order ID
      transaction.description = `Order for ${savedOrder.serviceType} #${savedOrder._id}`;
      await transaction.save({ session });

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

  try {
    const statusResponse = await axios.post(process.env.EXOBOOSTER_API_URL, {
      key: process.env.EXO_API_KEY,
      action: 'status',
      orders: providerOrderIds.join(','),
    });

    const bulkOps = [];
    for (const providerOrderId in statusResponse.data) {
      const remoteStatus = statusResponse.data[providerOrderId];
      if (remoteStatus && remoteStatus.status) {
        bulkOps.push({
          updateOne: {
            filter: { providerOrderId: providerOrderId, user: req.user.id },
            update: { $set: { status: remoteStatus.status } }
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