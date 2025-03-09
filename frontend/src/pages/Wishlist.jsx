import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  useToast,
  Image,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const toast = useToast();
  const { userId } = useSelector((state) => state.auth);
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const navigate = useNavigate();

  // Handle clicking the "Book Now" button
  const handleBookNow = (service) => {
    navigate(`/user-dashboard/${userId}/service/${service._id}`, { state: { service, isFromWishlist:true } });
  };

  // Fetch wishlist items for the logged-in customer
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(
          `http://localhost:5678/auth/wishlist/${userId}`
        );
        const data = await response.json();
        setWishlistItems(data);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Failed to fetch wishlist.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };

    fetchWishlist();
  }, [userId, toast]);

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = async (service_id) => {
    try {
      const response = await fetch(
        "http://localhost:5678/auth/wishlist/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userId,
            service_id: service_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Remove the item from the local state
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.service_id !== service_id)
        );
        toast({
          title: "Removed from wishlist",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message || "Failed to remove from wishlist",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred. Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Your Wishlist
      </Text>
      {wishlistItems.length === 0 ? (
        <Text>Your wishlist is empty.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {wishlistItems.map((item) => (
            <Box
              key={item._id}
              borderWidth="1px"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
              bg={cardBgColor}
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-10px)",
                boxShadow: "2xl",
              }}
            >
              <Box position="relative" height="200px" overflow="hidden">
                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.serviceName}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
                <Badge
                  position="absolute"
                  top={4}
                  left={4}
                  colorScheme="teal"
                  fontSize="0.8em"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {item.serviceType}
                </Badge>
              </Box>
              <VStack align="start" p={6} spacing={4}>
                <Text
                  fontWeight="bold"
                  fontSize="2xl"
                  color="teal.500"
                  lineHeight="tight"
                >
                  {item.serviceName}
                </Text>
                <Text color={textColor} fontSize="md" noOfLines={2}>
                  {item.description}
                </Text>
                <Flex
                  justify="space-between"
                  width="100%"
                  flexWrap="wrap"
                  gap={2}
                >
                  <HStack spacing={2} color={textColor}>
                    <Icon
                      as={CurrencyDollarIcon}
                      color="green.500"
                      boxSize={5}
                    />
                    <Text fontWeight="bold" fontSize="lg">
                      ${item.price}
                    </Text>
                  </HStack>
                  <HStack spacing={2} color={textColor}>
                    <Icon as={MapPinIcon} color="purple.500" boxSize={5} />
                    <Text fontSize="sm">{item.location}</Text>
                  </HStack>
                  <HStack spacing={2} color={textColor}>
                    <Icon as={ClockIcon} color="orange.500" boxSize={5} />
                    <Text fontSize="sm">{item.duration || "1 hour"}</Text>
                  </HStack>
                </Flex>
                <Flex justify="space-between" width="100%" mt={2}>
                  <Button
                  onClick={() => handleBookNow(item)}
                    colorScheme="teal"
                    size="md"
                    width="60%"
                    fontWeight="bold"
                    borderRadius="full"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s"
                  >
                    Book Now
                  </Button>
                  <Button
                    onClick={() => handleRemoveFromWishlist(item.service_id)}
                    variant="solid"
                    colorScheme="red"
                    size="md"
                    borderRadius="full"
                    width="100px" // Adjusted width to accommodate the icon and text
                    height="40px"
                    leftIcon={
                      <Icon as={HeartSolid} boxSize={5} color="white" />
                    }
                    px={4} // Add padding to the left and right
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.3s"
                  >
                    Remove
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Wishlist;
