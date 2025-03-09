const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  type: {
    type: String,
    enum: ["BOOKING_CREATED", "BOOKING_CONFIRMED", "BOOKING_CANCELLED", "PAYMENT_RECEIVED", "SERVICE_REMINDER"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: false
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    amount: Number,
    packageDetails: {
      packageName: String,
      numberOfPeople: Number,
      pricePerPerson: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model("notification", notificationSchema);
module.exports = Notification;