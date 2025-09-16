import { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Image,
  FormControl,
  FormLabel,
  Textarea,
  Button,
  useToast,
  Container,
  Flex,
  Badge,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Spinner,
  Center,
  Divider,
} from "@chakra-ui/react";
import {
  EmailIcon,
  PhoneIcon,
  StarIcon,
  CheckIcon,
  CalendarIcon,
  TimeIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  FaBuilding,
  FaCreditCard,
  FaShieldAlt,
  FaRocket,
  FaClock,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImages,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { InfoIcon } from "lucide-react";
import PackageSelectionCard from "./PackageSelectionCard";

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);
const MotionImage = motion(Image);

const ServiceDetails = () => {
  // State Management
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  // Hooks
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  // Check if service exists in location state
  const { service, isFromWishlist } = location.state || {};
  // Date and Time Management
  const getRoundedTime = (date = new Date(), interval = 15) => {
    const ms = 1000 * 60 * interval;
    return new Date(Math.ceil(date.getTime() / ms) * ms);
  };

  const now = new Date();
  const defaultStartDate = now;
  const defaultStartTimeObj = getRoundedTime(now, 15);
  const defaultStartTime = defaultStartTimeObj.toTimeString().slice(0, 5);
  const defaultEndTimeObj = new Date(
    defaultStartTimeObj.getTime() + 60 * 60 * 1000
  );
  const defaultEndTime = defaultEndTimeObj.toTimeString().slice(0, 5);

  const [startTime, setStartTime] = useState(defaultStartDate);
  const [endTime, setEndTime] = useState(defaultStartDate);
  const [startTimeInput, setStartTimeInput] = useState(defaultStartTime);
  const [endTimeInput, setEndTimeInput] = useState(defaultEndTime);

  // Theme and Style Management
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.600)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Effects
  useEffect(() => {
    console.log(service);
    if (!service) {
      toast({
        title: "Error",
        description: "Service details not found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/services");
      return;
    }

    fetchCustomerData();
  }, [service, userId]);

  // API Calls
  const fetchCustomerData = async () => {
    try {
      setIsPageLoading(true);
      const response = await axios.get(`https://eventease-1-bxq5.onrender.com/auth/${userId}`);
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError("Failed to load customer data");
      toast({
        title: "Error",
        description: "Failed to load customer data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleSendInquiry = async () => {
    if (!message.trim()) {
      toast({
        title: "Message is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://eventease-1-bxq5.onrender.com/auth/sendQuery",
        {
          to_email: service.email,
          from_email: customerData.email,
          message: message,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Inquiry sent successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setMessage("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!service) return 0;

    if (selectedPackage) {
      if (service.serviceType === "catering") {
        return selectedPackage.pricePerPerson * numberOfPeople;
      }
      return selectedPackage.packagePrice;
    }

    return service.price;
  };

  const handlePayment = async () => {
    if (!validateBookingTimes()) return;

    try {
      const startDateTime = combineDateAndTime(startTime, startTimeInput);
      const endDateTime = combineDateAndTime(endTime, endTimeInput);
      const finalPrice = calculatePrice();

      const orderResponse = await axios.post(
        "https://eventease-1-bxq5.onrender.com/payment/create-order",
        {
          amount: finalPrice * 100,
          customer_id: userId,
          service_id: service.service_id || service._id,
          package_id: selectedPackage?._id, // Include package ID if selected
          package_details: selectedPackage
            ? {
              package_name: selectedPackage.packageName,
              package_price:
                service.serviceType === "catering"
                  ? selectedPackage.pricePerPerson * numberOfPeople
                  : selectedPackage.packagePrice,
              number_of_people:
                service.serviceType === "catering"
                  ? numberOfPeople
                  : undefined,
            }
            : null,
        }
      );

      const options = {
        key: "rzp_test_SMZCi5l8zd0Bln",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: service.serviceName,
        description: selectedPackage
          ? `${selectedPackage.packageName} Package Booking`
          : "Service Booking Payment",
        order_id: orderResponse.data.id,
        handler: async (response) => {
          await handlePaymentVerification(response, startDateTime, endDateTime);
        },
        prefill: {
          name: customerData?.username,
          email: customerData?.email,
          contact: customerData?.mobileNumber,
        },
        theme: {
          color: "#3182CE",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      handlePaymentError(error);
    }
  };

  // Helper Functions
  const combineDateAndTime = (date, timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hour, minute, 0, 0);
    return combined;
  };

  const validateBookingTimes = () => {
    if (!startTime || !endTime || !startTimeInput || !endTimeInput) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end dates & times",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const startDateTime = combineDateAndTime(startTime, startTimeInput);
    const endDateTime = combineDateAndTime(endTime, endTimeInput);

    // Check if end time is before start time
    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid Time Selection",
        description: "End time must be after start time",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Get service hours based on service type
    let serviceStartHour, serviceEndHour;
    if (service.serviceType === "hall") {
      const [start, end] = service.hallDetails[0]?.hallTimeRange.split(" - ");
      serviceStartHour = parseInt(start);
      serviceEndHour = parseInt(end);
    } else {
      const [start, end] = service.serviceTimeRange.split(" - ");
      serviceStartHour = parseInt(start);
      serviceEndHour = parseInt(end);
    }

    // Check if selected times are within service hours
    const selectedStartHour = startDateTime.getHours();
    const selectedEndHour = endDateTime.getHours();

    if (
      selectedStartHour < serviceStartHour ||
      selectedEndHour > serviceEndHour
    ) {
      toast({
        title: "Invalid Time Selection",
        description: `Service is only available from ${serviceStartHour}:00 to ${serviceEndHour}:00`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Calculate duration in hours
    const durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60);

    // Check maximum hours based on service type
    if (service.serviceType === "hall") {
      const maxHours = service.hallDetails[0]?.hallMaxHours;
      const minHours = service.hallDetails[0]?.hallMinHours;
      if (durationInHours > maxHours) {
        toast({
          title: "Exceeds Maximum Duration",
          description: `Hall bookings cannot exceed ${maxHours} hours`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      if (durationInHours < minHours) {
        toast({
          title: "Below Minimum Duration",
          description: `Hall bookings must be at least ${minHours} hours`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } else if (service.serviceType === "catering") {
      if (durationInHours > service.cateringMaxHours) {
        toast({
          title: "Exceeds Maximum Duration",
          description: `Catering service cannot exceed ${service.cateringMaxHours} hours`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      if (durationInHours < service.cateringMinHours) {
        toast({
          title: "Below Minimum Duration",
          description: `Catering service must be at least ${service.cateringMinHours} hours`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    // Check if booking spans multiple days for decoration service
    if (service.serviceType === "decoration") {
      const startDay = startDateTime.getDate();
      const endDay = endDateTime.getDate();

      if (startDay !== endDay) {
        toast({
          title: "Invalid Booking Duration",
          description:
            "Decoration service must be completed within the same day",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    // If all validations pass
    return true;
  };

  const handlePaymentVerification = async (
    response,
    startDateTime,
    endDateTime
  ) => {
    try {
      const verificationResponse = await axios.post(
        "https://eventease-1-bxq5.onrender.com/payment/verify-payment",
        {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          customer_id: userId,
          service_id: service.service_id || service._id,
          serviceType: service.serviceType,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          amount: calculatePrice(),
          isFromWishlist,
          // Add package details if a package is selected
          package_details: selectedPackage
            ? {
              package_id: selectedPackage._id,
              package_name: selectedPackage.packageName,
              package_price:
                service.serviceType === "catering"
                  ? selectedPackage.pricePerPerson * numberOfPeople
                  : selectedPackage.packagePrice,
              number_of_people:
                service.serviceType === "catering"
                  ? numberOfPeople
                  : undefined,
              price_per_person:
                service.serviceType === "catering"
                  ? selectedPackage.pricePerPerson
                  : undefined,
              package_description: selectedPackage.packageDescription,
            }
            : null,
        }
      );

      if (verificationResponse.data.status === "success") {
        toast({
          title: "Booking Confirmed!",
          description: selectedPackage
            ? `Your booking for ${selectedPackage.packageName} package has been confirmed!`
            : "Payment successful and booking confirmed",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Payment verified but booking confirmation failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    toast({
      title: "Payment Failed",
      description: "Unable to process payment. Please try again",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  // Loading State
  if (isPageLoading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading service details...</Text>
        </VStack>
      </Center>
    );
  }

  // Error State
  if (error) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Heading color="red.500">Error</Heading>
          <Text>{error}</Text>
          <Button onClick={() => navigate("/services")}>Go Back</Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={12}>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <Box
          bg="linear-gradient(135deg, #1a365d 0%, #2d3748 100%)" // Dark professional gradient
          rounded="2xl"
          p={8}
          mb={12}
          position="relative"
          overflow="hidden"
          boxShadow="2xl"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            opacity={0.1}
            bgGradient="radial(circle at 20px 20px, rgba(255,255,255,0.1) 0%, transparent 40%)"
            backgroundSize="24px 24px"
          />

          <MotionFlex
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            zIndex={1}
            position="relative"
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            {/* Service Info */}
            <VStack
              align="start"
              spacing={6}
              maxW={{ base: "100%", md: "60%" }}
            >
              <VStack align="start" spacing={3}>
                <Badge
                  colorScheme="blue"
                  px={3}
                  py={1}
                  fontSize="md"
                  rounded="full"
                  textTransform="capitalize"
                  bg="whiteAlpha.200"
                  color="white"
                >
                  {service.serviceType}
                </Badge>

                <Heading
                  size="2xl"
                  color="white"
                  textShadow="0 2px 4px rgba(0,0,0,0.2)"
                  bgGradient="linear(to-r, white, blue.200)"
                  bgClip="text"
                >
                  {service.serviceName}
                </Heading>
              </VStack>

              <Text fontSize="xl" color="gray.100" lineHeight="tall">
                Premium {service.serviceType} Service
              </Text>

              {/* Current Date-Time Info */}
            </VStack>

            {/* Decorative Element */}
            <Box position="relative" display={{ base: "none", md: "block" }}>
              <Icon
                as={FaRocket}
                w="180px"
                h="180px"
                color="whiteAlpha.200"
                transform="rotate(45deg)"
                filter="drop-shadow(0 0 12px rgba(255,255,255,0.1))"
              />
              <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="full"
                height="full"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon
                  as={FaRocket}
                  w="180px"
                  h="180px"
                  color="whiteAlpha.100"
                  transform="rotate(45deg)"
                />
              </MotionBox>
            </Box>
          </MotionFlex>
        </Box>
        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={12}>
          {/* Service Images */}
          <Card p={6} shadow="xl" bg={cardBg}>
            <CardHeader>
              <Heading size="lg" color={textColor}>
                Service Gallery
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={2} spacing={4}>
                {service.image.map((src, index) => (
                  <MotionImage
                    key={index}
                    src={src}
                    alt={`Service ${index + 1}`}
                    objectFit="cover"
                    w="100%"
                    h="200px"
                    rounded="lg"
                    cursor="pointer"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setSelectedImage(src);
                      onImageOpen();
                    }}
                  />
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Service Details */}

          <Card
            p={0} // Remove default padding
            shadow="xl"
            bg={useColorModeValue("white", "gray.800")}
            overflow="hidden"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <CardHeader
              bg={useColorModeValue("blue.50", "gray.700")}
              borderBottom="2px solid"
              borderColor={useColorModeValue("blue.100", "blue.600")}
              py={6}
            >
              <Flex align="center" gap={3}>
                <Icon
                  as={FaImages}
                  w={6}
                  h={6}
                  color={useColorModeValue("blue.500", "blue.300")}
                />
                <Heading size="lg" color={textColor}>
                  Service Information
                </Heading>
              </Flex>
            </CardHeader>

            <CardBody p={6}>
              <VStack align="stretch" spacing={6}>
                <Box
                  p={5}
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  rounded="xl"
                  color="white"
                  shadow="lg"
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bg: "blackAlpha.100",
                    transform: "scale(1.5) rotate(12deg)",
                    transformOrigin: "center",
                    zIndex: 0,
                  }}
                >
                  <Heading size="md" mb={4} position="relative" zIndex={1}>
                    Contact Details
                  </Heading>

                  <VStack
                    align="stretch"
                    spacing={4}
                    position="relative"
                    zIndex={1}
                  >
                    {/* Phone Number */}
                    <Flex
                      align="center"
                      bg="whiteAlpha.200"
                      p={3}
                      rounded="lg"
                      _hover={{ bg: "whiteAlpha.300" }}
                      transition="all 0.3s"
                    >
                      <Icon as={PhoneIcon} w={5} h={5} mr={3} />
                      <Box>
                        <Text fontSize="sm" opacity={0.9}>
                          Phone Number
                        </Text>
                        <Text fontSize="lg" fontWeight="bold">
                          {service.mobileNumber}
                        </Text>
                      </Box>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        ml="auto"
                        leftIcon={<PhoneIcon />}
                        onClick={() =>
                          (window.location.href = `tel:${service.mobileNumber}`)
                        }
                        _hover={{ bg: "whiteAlpha.400" }}
                      >
                        Call Now
                      </Button>
                    </Flex>

                    {/* Email Address */}
                    <Flex
                      align="center"
                      bg="whiteAlpha.200"
                      p={3}
                      rounded="lg"
                      _hover={{ bg: "whiteAlpha.300" }}
                      transition="all 0.3s"
                    >
                      <Icon as={EmailIcon} w={5} h={5} mr={3} />
                      <Box>
                        <Text fontSize="sm" opacity={0.9}>
                          Email Address
                        </Text>
                        <Text fontSize="lg" fontWeight="bold">
                          {service.email}
                        </Text>
                      </Box>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        ml="auto"
                        leftIcon={<EmailIcon />}
                        onClick={() =>
                          (window.location.href = `mailto:${service.email}`)
                        }
                        _hover={{ bg: "whiteAlpha.400" }}
                      >
                        Send Email
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
                {/* Time Range Box - Modified based on service type */}
                <Box
                  p={4}
                  bg={useColorModeValue("blue.50", "gray.700")}
                  rounded="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaClock}
                      mr={4}
                      w={6}
                      h={6}
                      color={useColorModeValue("blue.500", "blue.300")}
                    />
                    <Box>
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        fontWeight="medium"
                      >
                        Service Hours
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {service.serviceType === "hall"
                          ? service.hallDetails[0]?.hallTimeRange
                          : service.serviceTimeRange}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Maximum Hours Box - Only for Hall and Catering */}
                {(service.serviceType === "hall" ||
                  service.serviceType === "catering") && (
                    <Box
                      p={4}
                      bg={useColorModeValue("orange.50", "gray.700")}
                      rounded="lg"
                      transition="all 0.3s"
                      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                    >
                      <Flex align="center">
                        <Icon
                          as={TimeIcon}
                          mr={4}
                          w={6}
                          h={6}
                          color={useColorModeValue("orange.500", "orange.300")}
                        />
                        <Box>
                          <Text
                            fontSize="sm"
                            color={useColorModeValue("gray.600", "gray.400")}
                            fontWeight="medium"
                          >
                            Maximum Booking Duration
                          </Text>
                          <Text fontSize="lg" fontWeight="bold">
                            {service.serviceType === "hall"
                              ? `${service.hallDetails[0]?.hallMaxHours} Hours`
                              : `${service.cateringMaxHours} Hours`}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  )}

                {/* Price Box */}
                <Box
                  p={4}
                  bg={useColorModeValue("green.50", "gray.700")}
                  rounded="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaDollarSign}
                      mr={4}
                      w={6}
                      h={6}
                      color={useColorModeValue("green.500", "green.300")}
                    />
                    <Box>
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        fontWeight="medium"
                      >
                        Service Price
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={useColorModeValue("green.600", "green.300")}
                      >
                        ₹{service.price}
                        <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                          {service.serviceType === "catering"
                            ? "per person"
                            : "base price"}
                        </Text>
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Location */}
                <Box
                  p={4}
                  bg={useColorModeValue("red.50", "gray.700")}
                  rounded="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaMapMarkerAlt}
                      mr={4}
                      w={6}
                      h={6}
                      color={useColorModeValue("red.500", "red.300")}
                    />
                    <Box>
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        fontWeight="medium"
                      >
                        Location
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {service.location}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Address */}
                <Box
                  p={4}
                  bg={useColorModeValue("purple.50", "gray.700")}
                  rounded="lg"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaBuilding}
                      mr={4}
                      w={6}
                      h={6}
                      color={useColorModeValue("purple.500", "purple.300")}
                    />
                    <Box>
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        fontWeight="medium"
                      >
                        Full Address
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {service.address}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Additional Information */}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Package Selection for Catering and Decoration */}
        {(service.serviceType === "catering" ||
          service.serviceType === "decoration") && (
            <PackageSelectionCard
              service={service}
              selectedPackage={selectedPackage}
              onPackageSelect={(pkg, people) => {
                setSelectedPackage(pkg);
                if (service.serviceType === "catering" && people) {
                  setNumberOfPeople(people);
                }
              }}
            />
          )}

        {/* Booking Section */}
        <Card
          shadow="lg"
          mb={12}
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <CardHeader
            bgGradient="linear(to-r, blue.400, blue.600)"
            py={6}
            px={8}
            borderBottom="2px solid"
            borderColor="blue.300"
          >
            <Flex align="center" gap={3}>
              <Icon
                as={CalendarIcon}
                w={6}
                h={6}
                color="white"
                filter="drop-shadow(0 0 4px rgba(66, 153, 225, 0.3))"
              />
              <Heading
                size="lg"
                color="white"
                textShadow="0 2px 4px rgba(0,0,0,0.1)"
              >
                Book Your Service
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody p={8}>
            <Box
              bg="gray.50"
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* Start Date */}
                <FormControl
                  isRequired
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="blue.200"
                  transition="all 0.3s"
                  position="relative"
                  zIndex="100"
                  _hover={{
                    borderColor: "blue.300",
                    transform: "translateY(-2px)",
                    shadow: "md",
                  }}
                >
                  <FormLabel
                    color="blue.600"
                    fontSize="md"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                  >
                    <Icon as={CalendarIcon} w={4} h={4} />
                    Start Date
                  </FormLabel>
                  <Box position="relative"> {/* Add this wrapper */}
                    <SingleDatepicker
                      name="startTime"
                      date={startTime}
                      onDateChange={setStartTime}
                      propsConfigs={{
                        dateNavBtnProps: {
                          colorScheme: "blue",
                          variant: "ghost",
                        },
                        dayOfMonthBtnProps: {
                          defaultBtnProps: {
                            bg: "white",
                            _hover: {
                              bg: "blue.50",
                            },
                          },
                          selectedBtnProps: {
                            background: "blue.500",
                            color: "white",
                          },
                        },
                        inputProps: {
                          size: "lg",
                          bg: "white",
                          borderColor: "gray.300",
                          _hover: {
                            borderColor: "blue.300",
                          },
                          _focus: {
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce",
                          },
                        },
                        popoverCompProps: { // Add this configuration
                          popoverProps: {
                            zIndex: 1000000, // Very high z-index
                          },
                        },
                      }}
                    />
                  </Box>
                </FormControl>

                {/* Start Time */}
                <FormControl
                  isRequired
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="blue.200"
                  transition="all 0.3s"
                  _hover={{
                    borderColor: "blue.300",
                    transform: "translateY(-2px)",
                    shadow: "md",
                  }}
                >
                  <FormLabel
                    color="blue.600"
                    fontSize="md"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                  >
                    <Icon as={TimeIcon} w={4} h={4} />
                    Start Time
                  </FormLabel>
                  <Input
                    type="time"
                    value={startTimeInput}
                    onChange={(e) => setStartTimeInput(e.target.value)}
                    size="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "blue.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                </FormControl>

                {/* End Date */}
                <FormControl
                  isRequired
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="blue.200"
                  transition="all 0.3s"
                  position="relative"
                  zIndex="98"
                  _hover={{
                    borderColor: "blue.300",
                    transform: "translateY(-2px)",
                    shadow: "md",
                  }}
                >
                  <FormLabel
                    color="blue.600"
                    fontSize="md"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                  >
                    <Icon as={CalendarIcon} w={4} h={4} />
                    End Date
                  </FormLabel>
                  <Box position="relative"> {/* Add this wrapper */}
                    <SingleDatepicker
                      name="endTime"
                      date={endTime}
                      onDateChange={setEndTime}
                      propsConfigs={{
                        dateNavBtnProps: {
                          colorScheme: "blue",
                          variant: "ghost",
                        },
                        dayOfMonthBtnProps: {
                          defaultBtnProps: {
                            bg: "white",
                            _hover: {
                              bg: "blue.50",
                            },
                          },
                          selectedBtnProps: {
                            background: "blue.500",
                            color: "white",
                          },
                        },
                        inputProps: {
                          size: "lg",
                          bg: "white",
                          borderColor: "gray.300",
                          _hover: {
                            borderColor: "blue.300",
                          },
                          _focus: {
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce",
                          },
                        },
                        popoverCompProps: { // Add this configuration
                          popoverProps: {
                            zIndex: 1000000, // Very high z-index
                          },
                        },
                      }}
                    />
                  </Box>
                </FormControl>

                {/* End Time */}
                <FormControl
                  isRequired
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="blue.200"
                  transition="all 0.3s"
                  _hover={{
                    borderColor: "blue.300",
                    transform: "translateY(-2px)",
                    shadow: "md",
                  }}
                >
                  <FormLabel
                    color="blue.600"
                    fontSize="md"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                  >
                    <Icon as={TimeIcon} w={4} h={4} />
                    End Time
                  </FormLabel>
                  <Input
                    type="time"
                    value={endTimeInput}
                    onChange={(e) => setEndTimeInput(e.target.value)}
                    size="lg"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "blue.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* time notice */}
            {/* Service Restrictions Box */}
            <Box
              mt={4}
              p={6}
              bg="gray.900"
              borderRadius="xl"
              border="1px solid"
              borderColor="blue.500"
              boxShadow="xl"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                backgroundImage:
                  "linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(99, 179, 237, 0.05) 100%)",
                zIndex: 0,
              }}
            >
              <VStack align="start" spacing={4} position="relative" zIndex={1}>
                <Flex
                  align="center"
                  gap={2}
                  bg="blue.500"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  width="fit-content"
                >
                  <Icon as={WarningIcon} w={5} h={5} color="white" />
                  <Text fontWeight="bold" color="white" fontSize="lg">
                    Important Booking Restrictions
                  </Text>
                </Flex>

                {service.serviceType === "hall" && (
                  <Box
                    p={4}
                    bg="blue.900"
                    borderRadius="lg"
                    w="full"
                    borderLeft="4px solid"
                    borderColor="blue.400"
                  >
                    <VStack align="start" spacing={3}>
                      <Flex align="center" gap={2}>
                        <Icon as={TimeIcon} w={5} h={5} color="blue.300" />
                        <Text color="blue.100" fontSize="md" fontWeight="bold">
                          Available Hours:
                        </Text>
                      </Flex>
                      <Text color="white" fontSize="xl" ml={7}>
                        {service.hallDetails[0]?.hallTimeRange}
                      </Text>
                      <Divider borderColor="blue.700" />
                      <Flex align="center" gap={2}>
                        <Icon as={InfoIcon} w={5} h={5} color="green.300" />
                        <Text color="green.100" fontSize="md" fontWeight="bold">
                          Minimum Duration:
                        </Text>
                      </Flex>
                      <Text color="green.200" fontSize="xl" ml={7}>
                        {service.hallDetails[0]?.hallMinHours} hours
                      </Text>
                      <Divider borderColor="blue.700" />
                      <Flex align="center" gap={2}>
                        <Icon as={WarningIcon} w={5} h={5} color="orange.300" />
                        <Text
                          color="orange.100"
                          fontSize="md"
                          fontWeight="bold"
                        >
                          Maximum Duration:
                        </Text>
                      </Flex>
                      <Text color="orange.200" fontSize="xl" ml={7}>
                        {service.hallDetails[0]?.hallMaxHours} hours
                      </Text>
                    </VStack>
                  </Box>
                )}

                {service.serviceType === "catering" && (
                  <Box
                    p={4}
                    bg="green.900"
                    borderRadius="lg"
                    w="full"
                    borderLeft="4px solid"
                    borderColor="green.400"
                  >
                    <VStack align="start" spacing={3}>
                      <Flex align="center" gap={2}>
                        <Icon as={TimeIcon} w={5} h={5} color="green.300" />
                        <Text color="green.100" fontSize="md" fontWeight="bold">
                          Available Hours:
                        </Text>
                      </Flex>
                      <Text color="white" fontSize="xl" ml={7}>
                        {service.serviceTimeRange}
                      </Text>
                      <Divider borderColor="green.700" />
                      <Flex align="center" gap={2}>
                        <Icon as={InfoIcon} w={5} h={5} color="green.300" />
                        <Text color="green.100" fontSize="md" fontWeight="bold">
                          Minimum Duration:
                        </Text>
                      </Flex>
                      <Text color="green.200" fontSize="xl" ml={7}>
                        {service.cateringMinHours} hours
                      </Text>
                      <Divider borderColor="green.700" />
                      <Flex align="center" gap={2}>
                        <Icon as={WarningIcon} w={5} h={5} color="yellow.300" />
                        <Text
                          color="yellow.100"
                          fontSize="md"
                          fontWeight="bold"
                        >
                          Maximum Duration:
                        </Text>
                      </Flex>
                      <Text color="yellow.200" fontSize="xl" ml={7}>
                        {service.cateringMaxHours} hours
                      </Text>
                    </VStack>
                  </Box>
                )}

                {service.serviceType === "decoration" && (
                  <Box
                    p={4}
                    bg="purple.900"
                    borderRadius="lg"
                    w="full"
                    borderLeft="4px solid"
                    borderColor="purple.400"
                  >
                    <VStack align="start" spacing={3}>
                      <Flex align="center" gap={2}>
                        <Icon as={TimeIcon} w={5} h={5} color="purple.300" />
                        <Text
                          color="purple.100"
                          fontSize="md"
                          fontWeight="bold"
                        >
                          Available Hours:
                        </Text>
                      </Flex>
                      <Text color="white" fontSize="xl" ml={7}>
                        {service.serviceTimeRange}
                      </Text>
                      <Divider borderColor="purple.700" />
                      <Flex align="center" gap={2}>
                        <Icon as={InfoIcon} w={5} h={5} color="red.300" />
                        <Text color="red.100" fontSize="md" fontWeight="bold">
                          Important Note:
                        </Text>
                      </Flex>
                      <Text color="red.200" fontSize="xl" ml={7}>
                        Must be completed within the same day
                      </Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
            {/* Inquiry Section */}
            <VStack spacing={6} align="stretch" mt={8}>
              <Heading size="md" color={textColor}>
                Send an Inquiry
              </Heading>
              <FormControl>
                <FormLabel>Your Message</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  minH="150px"
                  size="lg"
                  focusBorderColor="blue.500"
                  _hover={{
                    borderColor: "blue.300",
                  }}
                />
              </FormControl>
              <MotionButton
                colorScheme="blue"
                size="lg"
                leftIcon={<EmailIcon />}
                isLoading={isLoading}
                onClick={handleSendInquiry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                loadingText="Sending inquiry..."
              >
                Send Inquiry
              </MotionButton>
            </VStack>
          </CardBody>
        </Card>
        {/* Payment Section */}

        {/* Payment Section */}
        <MotionBox
          bg="gray.800" // Changed from bgGradient to a darker background
          p={8}
          rounded="xl"
          color="white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          boxShadow="2xl"
          mb={8}
          backgroundImage="linear-gradient(to right, rgba(44, 82, 130, 0.9), rgba(55, 48, 163, 0.9))" // Dark blue gradient
        >
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <VStack align={{ base: "center", md: "start" }} spacing={2}>
              <Heading
                size="lg"
                bgGradient="linear(to-r, teal.200, cyan.400)"
                bgClip="text"
              >
                Ready to Book?
              </Heading>
              <Text fontSize="lg" color="gray.100" fontWeight="medium">
                Secure your booking with easy payment
              </Text>
              <Text fontSize="sm" color="gray.300">
                {/* Add current date/time */}
                Booking on:{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </VStack>

            <MotionButton
              onClick={handlePayment}
              size="lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              fontSize="xl"
              py={6}
              px={8}
              bg="green.300"
              color="gray.800"
              _hover={{
                bg: "green.400",
                transform: "translateY(-2px)",
              }}
              boxShadow="lg"
              fontWeight="bold"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="60px"
            >
              <VStack spacing={0} align="center" width="250px" >
                <Text fontSize="sm" fontWeight="bold" textAlign="center">
                  Proceed to Payment
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="start">
                  {selectedPackage
                    ? service.serviceType === "catering"
                      ? `${selectedPackage.packageName} - ₹${selectedPackage.pricePerPerson} × ${numberOfPeople} people`
                      : `${selectedPackage.packageName} Package`
                    : "Standard Price"}
                </Text>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  ₹{calculatePrice()}
                </Text>
              </VStack>
            </MotionButton>

          </Flex>

          <Box mt={4} pt={4} borderTop="1px solid" borderColor="whiteAlpha.200">
            <Flex
              justify="space-between"
              color="gray.300"
              fontSize="sm"
              flexWrap="wrap"
              gap={2}
            >
              <Flex align="center" >
                <Icon as={FaShieldAlt} mr={2} />
                <Text>Secure Payment</Text>
              </Flex>
              <Flex align="center">
                <Icon as={CheckIcon} mr={2} />
                <Text>Instant Confirmation</Text>
              </Flex>
              <Flex align="center">
                <TimeIcon mr={2} />
                <Text>24/7 Support</Text>
              </Flex>
            </Flex>
          </Box>
        </MotionBox>
        {/* Image Modal */}
        <Modal
          isOpen={isImageOpen}
          onClose={onImageClose}
          size="4xl"
          motionPreset="slideInBottom"
        >
          <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
          <ModalContent bg={cardBg}>
            <ModalHeader color={textColor}>Service Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedImage && (
                <MotionImage
                  src={selectedImage}
                  alt="Selected service image"
                  w="100%"
                  h="auto"
                  rounded="md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </MotionBox>
    </Container>
  );
};

export default ServiceDetails;
