const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
// GET /api/notifications/:userId
router.get('/:userId', notificationController.getNotifications);

// Get unread notification count for a user
// GET /api/notifications/:userId/unread
router.get('/:userId/unread', notificationController.getUnreadCount);

// Mark a specific notification as read
// PUT /api/notifications/:notificationId/read
router.put('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read for a user
// PUT /api/notifications/:userId/read-all
router.put('/:userId/read-all', notificationController.markAllAsRead);

// Delete a specific notification
// DELETE /api/notifications/:notificationId
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;