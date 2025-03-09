const Notification = require("../models/notification");
const User = require("../models/User");


let io; //Store the io instance

exports.setIo = (socketIo) => {
  io = socketIo;
};

// Helper function to get current datetime
const getCurrentDateTime = () => new Date();

// Helper function to get user name from userId
const getUserName = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.username : 'Unknown User';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Unknown User';
  }
};

exports.createNotification = async (bookingData) => {
    try {
      // Get customer name
      const customerName = await getUserName(bookingData.customerId);
      const providerName = await getUserName(bookingData.serviceId);
  
      // Create notification for customer
      const customerNotification = await Notification.create({
        recipient: bookingData.customerId,
        type: "BOOKING_CREATED",
        title: "Booking Confirmed",
        message: `Your booking for ${bookingData.serviceType} service with ${providerName} has been confirmed.`,
        bookingId: bookingData._id,
        serviceId: bookingData.serviceId,
        metadata: {
          amount: bookingData.amount,
          packageDetails: {
            packageName: bookingData.package_details?.package_name || '',
            numberOfPeople: bookingData.package_details?.number_of_people || 0,
            pricePerPerson: bookingData.package_details?.price_per_person || 0
          }
        },
        createdAt: getCurrentDateTime()
      });
  
      // Emit to customer in real-time
      io.to(bookingData.customerId.toString()).emit('notification', customerNotification);
      console.log(`Customer notification sent at ${getCurrentDateTime().toISOString()}`);
  
      // Create notification for service provider
      const providerNotification = await Notification.create({
        recipient: bookingData.serviceId,
        type: "BOOKING_CREATED",
        title: "New Booking Received",
        message: `You have received a new booking for your ${bookingData.serviceType} service from ${customerName}.`,
        bookingId: bookingData._id,
        serviceId: bookingData.serviceId,
        metadata: {
          amount: bookingData.amount,
          packageDetails: {
            packageName: bookingData.package_details?.package_name || '',
            numberOfPeople: bookingData.package_details?.number_of_people || 0,
            pricePerPerson: bookingData.package_details?.price_per_person || 0
          }
        },
        createdAt: getCurrentDateTime()
      });
  
      // Emit to service provider in real-time
      io.to(bookingData.serviceId.toString()).emit('notification', providerNotification);
      console.log(`Service provider notification sent at ${getCurrentDateTime().toISOString()}`);
  
      return { customerNotification, providerNotification };
    } catch (error) {
      console.error("Failed to create notifications:", error);
      throw error;
    }
  };
  

  exports.createPaymentNotification = async (paymentData) => {
    try {
      const customerName = await getUserName(paymentData.customerId);
      const providerName = await getUserName(paymentData.serviceId);
  
      // Customer notification
      const customerNotification = await Notification.create({
        recipient: paymentData.customerId,
        type: "PAYMENT_RECEIVED",
        title: "Payment Successful",
        message: `Payment of ₹${paymentData.amount/100} received for your ${paymentData.serviceType} booking.`,
        bookingId: paymentData.bookingId,
        serviceId: paymentData.serviceId,
        metadata: {
          amount: paymentData.amount,
          packageDetails: {
            packageName: paymentData.package_details?.package_name || '',
            numberOfPeople: paymentData.package_details?.number_of_people || 0,
            pricePerPerson: paymentData.package_details?.price_per_person || 0
          }
        },
        createdAt: getCurrentDateTime()
      });
  
      // Service provider notification
      const providerNotification = await Notification.create({
        recipient: paymentData.serviceId,
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        message: `Payment of ₹${paymentData.amount/100} received from ${customerName} for ${paymentData.serviceType} booking.`,
        bookingId: paymentData.bookingId,
        serviceId: paymentData.serviceId,
        metadata: {
          amount: paymentData.amount,
          packageDetails: {
            packageName: paymentData.package_details?.package_name || '',
            numberOfPeople: paymentData.package_details?.number_of_people || 0,
            pricePerPerson: paymentData.package_details?.price_per_person || 0
          }
        },
        createdAt: getCurrentDateTime()
      });
  
      // Emit notifications
      io.to(paymentData.customerId.toString()).emit('notification', customerNotification);
      io.to(paymentData.serviceId.toString()).emit('notification', providerNotification);
      
      console.log(`Payment notifications sent at ${getCurrentDateTime().toISOString()}`);
  
      return { customerNotification, providerNotification };
    } catch (error) {
      console.error("Failed to create payment notification:", error);
      throw error;
    }
  };

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.params.userId
    })
    .sort({ createdAt: -1 })
    .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Emit update to recipient
    io.to(notification.recipient.toString()).emit('notificationUpdate', {
      id: notification._id,
      isRead: true,
      updateTime: getCurrentDateTime().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.params.userId, isRead: false },
      { isRead: true }
    );

    // Emit update to recipient
    io.to(req.params.userId).emit('allNotificationsRead', {
      timestamp: getCurrentDateTime().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.params.userId,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Emit deletion event to recipient
    io.to(notification.recipient.toString()).emit('notificationDeleted', {
      id: notification._id,
      deletedAt: getCurrentDateTime().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

exports.createErrorNotification = async (errorData) => {
    try {
      const notification = await Notification.create({
        recipient: errorData.userId,
        type: "BOOKING_CANCELLED", // Using an existing type from your schema
        title: errorData.title || "Error Occurred",
        message: errorData.message || "An error occurred during the operation",
        bookingId: errorData.bookingId,
        serviceId: errorData.serviceId,
        metadata: {
          amount: errorData.amount,
          packageDetails: {
            packageName: '',
            numberOfPeople: 0,
            pricePerPerson: 0
          }
        },
        createdAt: getCurrentDateTime()
      });
  
      io.to(errorData.userId.toString()).emit('notification', notification);
      console.log(`Error notification sent at ${getCurrentDateTime().toISOString()}`);
  
      return notification;
    } catch (error) {
      console.error("Failed to create error notification:", error);
    }
  };