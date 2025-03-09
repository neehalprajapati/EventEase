import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Button,
  Badge,
  IconButton,
  Flex,
  Divider
} from '@chakra-ui/react';
import { BellIcon, CheckIcon } from '@chakra-ui/icons';
import { getNotifications, getUnreadCount, markAllAsRead } from '../../services/notificationService';
import NotificationItem from './NotificationItem';
import { setupNotifications } from '../../services/socket';

const NotificationList = ({ userId, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(userId);
        setNotifications(data);
        const { count } = await getUnreadCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const cleanup = setupNotifications(userId, {
      onNewNotification: (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      },
      onNotificationUpdate: (update) => {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === update.id ? { ...notif, isRead: update.isRead } : notif
          )
        );
      },
      onAllRead: () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      },
      onDelete: (deletedId) => {
        setNotifications(prev => prev.filter(notif => notif._id !== deletedId));
      }
    });

    return cleanup;
  }, [userId]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bgColor}
      borderColor={borderColor}
      overflow="hidden"
    >
      <Flex p={4} justify="space-between" align="center" bg={useColorModeValue('gray.50', 'gray.700')}>
        <Flex align="center">
          <BellIcon mr={2} />
          <Text fontWeight="bold">Notifications</Text>
          {unreadCount > 0 && (
            <Badge ml={2} colorScheme="red" borderRadius="full">
              {unreadCount}
            </Badge>
          )}
        </Flex>
        {unreadCount > 0 && (
          <IconButton
            size="sm"
            icon={<CheckIcon />}
            aria-label="Mark all as read"
            onClick={handleMarkAllRead}
            colorScheme="blue"
            variant="ghost"
          />
        )}
      </Flex>
      <Divider />
      <VStack spacing={0} align="stretch" maxH="600px" overflowY="auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              userType={userType}
            />
          ))
        ) : (
          <Box p={8} textAlign="center">
            <Text color="gray.500">No notifications yet</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default NotificationList;