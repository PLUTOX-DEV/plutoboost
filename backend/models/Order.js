import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This assumes you have a User model
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  orderDetails: {
    type: String,
    required: true,
  },
  link: { type: String },
  quantity: { type: Number },
  platform: { type: String },
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  fee: { // fee is an alias for profit on orders
    type: Number,
    required: true,
  },
  providerOrderId: { type: String }, // To store the ID from ExoBooster
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'In Progress', 'Completed', 'Cancelled', 'Failed'],
    default: 'Pending',
  },
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('Order', OrderSchema);