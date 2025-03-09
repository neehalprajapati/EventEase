const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SMZCi5l8zd0Bln",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "cOPsrLBEspTr5AVcS4WmlkQi",
});

module.exports = razorpay;
