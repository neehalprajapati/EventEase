// models/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  serviceType: { 
    type: String, 
    enum: ["hall", "decoration", "catering"], 
    required: true 
  },
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  paymentId: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  package_details: {
    package_id: String,
    package_name: String,
    package_price: Number,
    number_of_people: Number,
    price_per_person: Number,
    package_description: String
  },
}, { timestamps: true });

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;