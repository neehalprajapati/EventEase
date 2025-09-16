import { useState } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  CurrencyRupeeIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const toast = useToast();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const badgeBgColor = useColorModeValue("teal.100", "teal.900");
  const badgeTextColor = useColorModeValue("teal.800", "teal.100");
  const { userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleBookNow = (service) => {
    navigate(`/user-dashboard/${userId}/service/${service._id}`, {
      state: { service, isFromWishlist: false }
    });
  };

  const handleWishlist = async () => {
    try {
      // Determine which API endpoint to use based on current wishlist status
      const endpoint = isWishlisted
        ? "https://eventease-1-bxq5.onrender.com/auth/wishlist/remove"
        : "https://eventease-1-bxq5.onrender.com/auth/wishlist/add";

      const response = await fetch(endpoint, {
        method: isWishlisted ? "DELETE" : "POST", // Use DELETE for remove, POST for add
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: userId,
          service_id: service._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        toast({
          title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
          status: isWishlisted ? "info" : "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message || `Failed to ${isWishlisted ? 'remove from' : 'add to'} wishlist`,
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
    <Box
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
      position="relative"
    >
      <Box position="relative" height="200px" overflow="hidden">
        <Image
          src={service.thumbnail || "/placeholder.svg"}
          alt={service.serviceName}
          width="100%"
          height="100%"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: "scale(1.05)" }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.3)"
          transition="opacity 0.3s"
          opacity={0}
          _groupHover={{ opacity: 1 }}
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
          bg={badgeBgColor}
          color={badgeTextColor}
        >
          {service.serviceType}
        </Badge>
      </Box>
      <VStack align="start" p={6} spacing={4}>
        <Text
          fontWeight="bold"
          fontSize="2xl"
          color="teal.500"
          lineHeight="tight"
        >
          {service.serviceName}
        </Text>
        <Text color={textColor} fontSize="md" noOfLines={2}>
          {service.description}
        </Text>
        <Flex justify="space-between" width="100%" flexWrap="wrap" gap={2}>
          <HStack spacing={2} color={textColor}>
            <Text fontWeight="bold" fontSize="lg">
              ₹{service.price}
            </Text>
          </HStack>
          <HStack spacing={2} color={textColor}>
            <Icon as={MapPinIcon} color="purple.500" boxSize={5} />
            <Text fontSize="sm">{service.location}</Text>
          </HStack>
        </Flex>
        <Flex justify="space-between" width="100%" mt={2}>
          <Button
            onClick={() => handleBookNow(service)}
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
          <Tooltip
            label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            placement="top"
          >
            <Box position="relative" width="80px" height="40px">
              <AnimatePresence initial={false}>
                <motion.div
                  key={isWishlisted ? "wishlisted" : "not-wishlisted"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={handleWishlist}
                    variant={isWishlisted ? "solid" : "outline"}
                    colorScheme={isWishlisted ? "red" : "gray"}
                    size="md"
                    borderRadius="full"
                    width="100%"
                    height="100%"
                    leftIcon={
                      <Icon
                        as={isWishlisted ? HeartSolid : HeartOutline}
                        boxSize={5}
                        color={isWishlisted ? "white" : "gray.500"}
                      />
                    }
                  >
                    {isWishlisted ? "Saved" : "Save"}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Tooltip>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ServiceCard;
