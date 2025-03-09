import React from "react";
import {
  Box,
  Text,
  IconButton,
  useColorModeValue,
  HStack,
  VStack,
  Badge,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import {
  markAsRead,
  deleteNotification,
} from "../../services/notificationService";

const NotificationItem = ({ notification }) => {
  const bgColor = useColorModeValue(
    notification.isRead ? "white" : "gray.50",
    notification.isRead ? "gray.800" : "gray.700"
  );
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notification._id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification._id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "BOOKING_CREATED":
        return "green";
      case "PAYMENT_RECEIVED":
        return "blue";
      case "BOOKING_CANCELLED":
        return "red";
      default:
        return "purple";
    }
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={2}>
        <HStack>
          <Badge colorScheme={getNotificationColor(notification.type)}>
            {notification.type}
          </Badge>
          <Spacer />
          <Text fontSize="xs" color="gray.500">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </Text>
        </HStack>

        <Text fontWeight="semibold">{notification.title}</Text>
        <Text fontSize="sm" color="gray.600">
          {notification.message}
        </Text>

        {notification.metadata?.amount && (
          <Text fontSize="sm" color="gray.500">
            Amount: ₹{notification.metadata.amount / 100}
          </Text>
        )}

        {notification.metadata?.packageDetails?.packageName && (
          <Text fontSize="sm" color="gray.500">
            Package: {notification.metadata.packageDetails.packageName}
          </Text>
        )}

        <HStack justify="flex-end" spacing={2}>
          {!notification.isRead && (
            <IconButton
              size="sm"
              icon={<CheckIcon />}
              aria-label="Mark as read"
              onClick={handleMarkAsRead}
              colorScheme="green"
              variant="ghost"
            />
          )}
          <IconButton
            size="sm"
            icon={<DeleteIcon />}
            aria-label="Delete"
            onClick={handleDelete}
            colorScheme="red"
            variant="ghost"
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default NotificationItem;
