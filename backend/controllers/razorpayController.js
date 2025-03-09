const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const notificationController = require("./notificationController")

exports.createOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount, // Amount in paise
    currency: "INR",
    receipt: "order_rcptid_" + Math.floor(Math.random() * 1000),
  };

  try {
    console.log("Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    order_id,
    payment_id,
    signature,
    customer_id,
    service_id,
    serviceType,
    startTime,
    endTime,
    amount,
    isFromWishlist,
    package_details,
  } = req.body;

  try {
    // Verify payment signature
    console.log("Verifying payment with data:", req.body);
    const generatedSignature = crypto
      .createHmac("sha256", "cOPsrLBEspTr5AVcS4WmlkQi")
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid signature" });
    }

    // Remove from wishlist
    if (isFromWishlist) {
      try {
        const wishlistResponse = await fetch(
          "http://localhost:5678/auth/wishlist/remove",
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id, service_id }),
          }
        );

        if (!wishlistResponse.ok) {
          console.warn(
            "Failed to remove from wishlist, but continuing with booking"
          );
          // We'll continue with the booking even if wishlist removal fails
        }
      } catch (wishlistError) {
        console.warn("Wishlist removal error:", wishlistError);
        // We'll continue with the booking even if wishlist removal fails
      }
    }

    // Create booking

    const bookingData = {
      customerId: customer_id,
      serviceId: service_id,
      serviceType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: "confirmed",
      paymentId: payment_id,
      amount,
    };
    // Add package details if they exist
    if (package_details) {
      bookingData.package_details = {
        package_id: package_details.package_id,
        package_name: package_details.package_name,
        package_price: package_details.package_price,
        package_description: package_details.package_description,
      };

      // Add catering-specific details if it's a catering service
      if (serviceType === "catering" && package_details.number_of_people) {
        bookingData.package_details.number_of_people =
          package_details.number_of_people;
        bookingData.package_details.price_per_person =
          package_details.price_per_person;
      }
    }

    const newBooking = await Booking.create(bookingData);
    console.log("Booking created successfully:", newBooking);

    try {
      await notificationController.createNotification({
        ...bookingData,
        _id: newBooking._id,
        customerId: customer_id
      });
    } catch (notificationError) {
      console.error("Failed to create booking notification:", notificationError);
      // Continue execution even if notification fails
    }

     // Create payment notification
     try {
      await notificationController.createPaymentNotification({
        customerId: customer_id,
        serviceId: service_id,
        serviceType,
        bookingId: newBooking._id,
        amount,
        package_details,
        paymentId: payment_id
      });
    } catch (notificationError) {
      console.error("Failed to create payment notification:", notificationError);
      // Continue execution even if notification fails
    }

    res.json({
      status: "success",
      booking: {
        id: newBooking._id,
        serviceType: newBooking.serviceType,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        amount: newBooking.amount,
        package_details: newBooking.package_details,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    // Create error notification
    try {
      await notificationController.createErrorNotification({
        userId: customer_id,
        title: "Payment Processing Error",
        message: "There was an error processing your payment. Please contact support.",
        bookingId: null,
        serviceId: service_id,
        amount: amount
      });
    } catch (notificationError) {
      console.error("Failed to create error notification:", notificationError);
    }
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
