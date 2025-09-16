import { io } from 'socket.io-client';

const SOCKET_URL = 'https://eventease-1-bxq5.onrender.com';
const CURRENT_TIME = "2025-02-26 16:58:44";
const CURRENT_USER = "DHRUV-85";

// Create socket instance without user ID initially
let socket = io(SOCKET_URL, {
  withCredentials: true,
});

// Function to initialize socket with user ID
export const initializeSocket = (userId) => {
  // Disconnect existing socket if any
  if (socket.connected) {
    socket.disconnect();
  }

  // Create new socket connection with user ID
  socket = io(SOCKET_URL, {
    withCredentials: true,
    auth: {
      userId: userId
    }
  });

  return socket;
};

export const setupNotifications = (userId, callbacks) => {
  // Initialize socket with user ID
  const currentSocket = initializeSocket(userId);

  // Join user's room
  currentSocket.emit('join', userId);

  // Listen for notifications
  currentSocket.on('notification', callbacks.onNewNotification);
  currentSocket.on('notificationUpdate', callbacks.onNotificationUpdate);
  currentSocket.on('allNotificationsRead', callbacks.onAllRead);
  currentSocket.on('notificationDeleted', (data) => callbacks.onDelete(data.id));

  // Return cleanup function
  return () => {
    currentSocket.off('notification');
    currentSocket.off('notificationUpdate');
    currentSocket.off('allNotificationsRead');
    currentSocket.off('notificationDeleted');
  };
};

export default socket;
