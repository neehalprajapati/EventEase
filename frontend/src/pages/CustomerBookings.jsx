import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Skeleton,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
  Card,
  Flex,
  Icon,
  Tooltip,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  Button,
  HStack,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaBox,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MdEventAvailable } from "react-icons/md";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTr = motion(Tr);

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useSelector((state) => state.auth);
  const [serviceDetailsMap, setServiceDetailsMap] = useState({});

  // Responsive config
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tableVariant = useBreakpointValue({ base: "simple", md: "striped" });

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.500, purple.600)",
    "linear(to-r, blue.600, purple.700)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Fetch bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5678/auth/bookings?customerId=${userId}`
        );
        setBookings(data);
      } catch (err) {
        setError("Failed to load bookings. Please refresh the page.");
        console.error("Booking fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const details = {};
        for (const booking of bookings) {
          const { data } = await axios.get(
            `http://localhost:5678/auth/${booking.serviceId}`
          );
          details[booking.serviceId] = data;
        }
        setServiceDetailsMap(details);
      } catch (err) {
        console.error("Service details error:", err);
      }
    };
    bookings.length > 0 && fetchServiceDetails();
  }, [bookings]);

  // Loading skeleton
  const SkeletonRow = () => (
    <Tr>
      {[...Array(8)].map((_, i) => (
        <Td key={i}>
          <Skeleton height="20px" />
        </Td>
      ))}
    </Tr>
  );

  // Summary stats
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.startTime) > new Date()
  ).length;

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      p={{ base: 2, md: 4 }}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading
          as="h1"
          size="xl"
          bgGradient={bgGradient}
          bgClip="text"
          letterSpacing="tight"
        >
          My Bookings
        </Heading>
        <Button leftIcon={<FaPrint />} colorScheme="blue" variant="ghost">
          Export
        </Button>
      </Flex>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={8}>
        <MotionCard
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -2 }}
        >
          <Flex align="center">
            <Icon as={MdEventAvailable} boxSize={8} color="blue.500" mr={3} />
            <Box>
              <Text fontSize="sm" color={textColor}>
                Total Bookings
              </Text>
              <Heading size="lg">{bookings.length}</Heading>
            </Box>
          </Flex>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -2 }}
        >
          <Flex align="center">
            <Icon as={FaMoneyBillWave} boxSize={8} color="green.500" mr={3} />
            <Box>
              <Text fontSize="sm" color={textColor}>
                Total Spent
              </Text>
              <Heading size="lg">${totalSpent}</Heading>
            </Box>
          </Flex>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -2 }}
        >
          <Flex align="center">
            <Icon as={FaClock} boxSize={8} color="purple.500" mr={3} />
            <Box>
              <Text fontSize="sm" color={textColor}>
                Upcoming
              </Text>
              <Heading size="lg">{upcomingBookings}</Heading>
            </Box>
          </Flex>
        </MotionCard>

        <MotionCard
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -2 }}
        >
          <Flex align="center">
            <Icon as={FaBox} boxSize={8} color="orange.500" mr={3} />
            <Box>
              <Text fontSize="sm" color={textColor}>
                Package Bookings
              </Text>
              <Heading size="lg">
                {bookings.filter((b) => b.package_details).length}
              </Heading>
            </Box>
          </Flex>
        </MotionCard>
      </SimpleGrid>

      {/* Bookings Table */}
      <MotionCard
        bg={cardBg}
        borderRadius="xl"
        boxShadow="xl"
        overflow="hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        {loading ? (
          <Table>
            <Thead bg={useColorModeValue("gray.50", "gray.700")}>
              <Tr>
                {[
                  "Company",
                  "Type",
                  "Package Details",
                  "Booked",
                  "Start",
                  "End",
                  "Status",
                  "Amount",
                ].map((header) => (
                  <Th key={header}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(3)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </Tbody>
          </Table>
        ) : error ? (
          <Alert status="error" variant="left-accent" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : bookings.length === 0 ? (
          <Flex p={8} direction="column" align="center">
            <Icon as={FaCalendarAlt} boxSize={12} mb={4} color="gray.400" />
            <Text fontSize="lg" color="gray.500">
              No bookings found
            </Text>
          </Flex>
        ) : (
          <>
            <Table variant={tableVariant} size={isMobile ? "sm" : "md"}>
              <Thead bg={useColorModeValue("blue.50", "blue.900")}>
                <Tr>
                  <Th>Service Company</Th>
                  <Th>Type</Th>
                  <Th>Package Details</Th>
                  <Th>Booked On</Th>
                  <Th>Start Time</Th>
                  <Th>End Time</Th>
                  <Th>Status</Th>
                  <Th>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bookings.map((booking) => (
                  <MotionTr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                  >
                    <Td>
                      <HStack>
                        <Icon as={FaBuilding} color="blue.400" />
                        <Text fontWeight="medium">
                          {serviceDetailsMap[booking.serviceId]?.serviceName ||
                            "N/A"}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="purple" variant="subtle">
                        {booking.serviceType}
                      </Badge>
                    </Td>
                    {/* New Package Details Column */}
                    <Td>
                      {(booking.serviceType === "catering" ||
                        booking.serviceType === "decoration") &&
                      booking.package_details ? (
                        <VStack align="start" spacing={1}>
                          <Tooltip
                            label={booking.package_details.package_description}
                            hasArrow
                            placement="top"
                          >
                            <Badge colorScheme="blue" variant="subtle">
                              {booking.package_details.package_name}
                            </Badge>
                          </Tooltip>
                          {booking.serviceType === "catering" && (
                            <Text fontSize="sm" color={textColor}>
                              {booking.package_details.number_of_people} people
                              × ₹{booking.package_details.price_per_person}
                              /person
                            </Text>
                          )}
                          {booking.serviceType === "decoration" && (
                            <Text fontSize="sm" color={textColor}>
                              Package Price: ₹
                              {booking.package_details.package_price}
                            </Text>
                          )}
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          Standard Booking
                        </Text>
                      )}
                    </Td>
                    <Td>
                      <Tooltip
                        label={format(new Date(booking.createdAt), "PPPPp")}
                      >
                        <Text>
                          {format(new Date(booking.createdAt), "dd MMM yyyy")}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <HStack>
                        <Icon as={FaClock} color="green.400" />
                        <Text>
                          {format(new Date(booking.startTime), "dd MMM, HH:mm")}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <Icon as={FaClock} color="red.400" />
                        <Text>
                          {format(new Date(booking.endTime), "dd MMM, HH:mm")}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          booking.status === "confirmed" ? "green" : "red"
                        }
                        px={3}
                        py={1}
                        borderRadius="full"
                        variant="subtle"
                      >
                        <HStack spacing={1}>
                          <Icon
                            as={
                              booking.status === "confirmed"
                                ? FaCheckCircle
                                : FaTimesCircle
                            }
                            boxSize={4}
                          />
                          <Text>{booking.status}</Text>
                        </HStack>
                      </Badge>
                    </Td>
                    <Td
                      fontWeight="bold"
                      color={useColorModeValue("green.600", "green.300")}
                    >
                      ${booking.amount}
                    </Td>
                  </MotionTr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </MotionCard>
    </MotionBox>
  );
};

export default CustomerBookings;
