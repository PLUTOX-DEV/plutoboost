import Log from './models/Log.js';

export const createLog = async (level, message, type) => {
  try {
    const logEntry = new Log({ level, message, type });
    await logEntry.save();
  } catch (error) {
    // If logging fails, we just log to console to avoid crashing the app
    console.error('Failed to create log entry:', error);
  }
};