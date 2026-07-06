import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, enum: ['info', 'warning', 'error'], required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['system', 'user', 'order', 'payment', 'security', 'support', 'watchdog'], // Added 'watchdog'
    required: true,
  },
});

// Ensure the model is only compiled once
const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);

export default Log;