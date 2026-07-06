import mongoose from 'mongoose';
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'purchase', 'withdrawal', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Completed',
  },
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);