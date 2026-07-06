import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // Not required, as some notifications can be broadcasts
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isBroadcast: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Index for faster querying of user-specific, unread notifications
NotificationSchema.index({ user: 1, read: 1 });
NotificationSchema.index({ isBroadcast: 1, read: 1 });

export default mongoose.model('Notification', NotificationSchema);