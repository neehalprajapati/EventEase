import { useEffect, useState } from "react"
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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react"
import { EmailIcon, PhoneIcon, StarIcon, CheckIcon } from "@chakra-ui/icons"
import { FaBuilding, FaCreditCard, FaShieldAlt, FaRocket, FaPaypal, FaApplePay, FaGooglePay } from "react-icons/fa"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionButton = motion(Button)

const ServiceDetails = () => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const [customerEmail, setCustomerEmail] = useState("")
  const location = useLocation()
  const { service } = location.state
  const { userId } = useSelector((state) => state.auth)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgGradient = useColorModeValue("linear(to-r, blue.400, purple.500)", "linear(to-r, blue.600, purple.600)")
  const bgColor = useColorModeValue("gray.50", "gray.700")

  useEffect(() => {
    const fetchCustomerEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5678/auth/${userId}`)
        setCustomerEmail(response.data.email)
      } catch (error) {
        console.error("Error fetching customer email:", error)
      }
    }

    fetchCustomerEmail()
  }, [userId])

  const handleSendInquiry = async () => {
    if (!message.trim()) {
      toast({
        title: "Message is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:5678/auth/sendQuery", {
        to_email: service.email,
        from_email: customerEmail,
        message: message,
      })

      if (response.status === 200) {
        toast({
          title: "Inquiry sent!",
          status: "success",
          duration: 2000,
          isClosable: true,
        })
        setMessage("")
      }
    } catch (error) {
      console.error("Failed to send inquiry:", error)
      toast({
        title: "Failed to send inquiry",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
    }
    setIsLoading(false)
  }

  return (
    <Container maxW="6xl" py={12}>
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Hero Section */}
        <Box
          bg={bgGradient}
          rounded="2xl"
          p={8}
          mb={12}
          color="white"
          position="relative"
          overflow="hidden"
          boxShadow="xl"
        >
          <MotionFlex
            zIndex={1}
            position="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <VStack align="start" spacing={4}>
              <Heading size="2xl">{service.serviceName}</Heading>
              <Text fontSize="xl">Premium Quality Service</Text>
              <Flex align="center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} color="yellow.400" />
                ))}
                <Text ml={2} fontWeight="bold">
                  5.0 (50+ reviews)
                </Text>
              </Flex>
              <Badge colorScheme="green" p={2} fontSize="md">
                {service.serviceType}
              </Badge>
            </VStack>
          </MotionFlex>
          <Icon
            as={FaRocket}
            position="absolute"
            right="-50px"
            top="-50px"
            w="300px"
            h="300px"
            opacity={0.1}
            transform="rotate(45deg)"
          />
        </Box>

        <Card shadow="xl" rounded="xl" overflow="hidden">
          <CardHeader borderBottom="1px" borderColor="gray.100" bg={bgColor}>
            <Flex justify="space-between" align="center">
              <Heading size="lg" bgGradient={bgGradient} bgClip="text">
                Service Overview
              </Heading>
              <Badge colorScheme="purple" px={3} py={1} rounded="full">
                Premium
              </Badge>
            </Flex>
          </CardHeader>

          <CardBody p={8}>
            {/* Image Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={12}>
              <AnimatePresence>
                {service.image.map((src, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Service ${index + 1}`}
                      objectFit="cover"
                      w="100%"
                      h="200px"
                      rounded="lg"
                      shadow="md"
                    />
                  </MotionBox>
                ))}
              </AnimatePresence>
            </SimpleGrid>

            {/* Contact Information */}
            <Wrap spacing={6} mb={12} justify="center">
              <WrapItem>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card p={4} variant="outline" w="250px" h="100px">
                    <Flex align="center" h="100%">
                      <Box p={2} bg="blue.500" color="white" rounded="lg" mr={4}>
                        <Icon as={FaBuilding} boxSize={6} />
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">
                          Company
                        </Text>
                        <Text fontWeight="bold">{service.serviceName}</Text>
                      </Box>
                    </Flex>
                  </Card>
                </MotionBox>
              </WrapItem>
              <WrapItem>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card p={4} variant="outline" w="250px" h="100px">
                    <Flex align="center" h="100%">
                      <Box p={2} bg="purple.500" color="white" rounded="lg" mr={4}>
                        <PhoneIcon boxSize={6} />
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">
                          Phone
                        </Text>
                        <Text fontWeight="bold">{service.mobileNumber}</Text>
                      </Box>
                    </Flex>
                  </Card>
                </MotionBox>
              </WrapItem>
              <WrapItem>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card p={4} variant="outline" w="250px" h="100px">
                    <Flex align="center" h="100%">
                      <Box p={2} bg="pink.500" color="white" rounded="lg" mr={4}>
                        <EmailIcon boxSize={6} />
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">
                          Email
                        </Text>
                        <Text fontWeight="bold">{service.email}</Text>
                      </Box>
                    </Flex>
                  </Card>
                </MotionBox>
              </WrapItem>
            </Wrap>

            {/* Features Section */}
            <Box mb={12}>
              <Heading size="lg" mb={6} bgGradient={bgGradient} bgClip="text">
                Service Features
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {["24/7 Support", "Expert Team", "Quality Assurance", "Fast Turnaround"].map((feature, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Flex align="center" bg={bgColor} p={4} rounded="lg">
                      <Icon as={CheckIcon} color="green.500" boxSize={5} mr={4} />
                      <Text fontWeight="medium">{feature}</Text>
                    </Flex>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>

            {/* Inquiry Form */}
            <VStack spacing={6} align="stretch" mb={12}>
              <Heading size="lg" bgGradient={bgGradient} bgClip="text">
                Send an Inquiry
              </Heading>
              <FormControl>
                <FormLabel>Your Message</FormLabel>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  minH="150px"
                  focusBorderColor="purple.500"
                />
              </FormControl>
              <MotionButton
                colorScheme="purple"
                isLoading={isLoading}
                loadingText="Sending..."
                onClick={handleSendInquiry}
                leftIcon={<EmailIcon />}
                size="lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Inquiry
              </MotionButton>
            </VStack>

            {/* Payment Section */}
            <MotionBox
              bg={bgGradient}
              p={8}
              rounded="xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              boxShadow="2xl"
              mb={8}
            >
              <Flex justify="space-between" align="center" flexDirection={{ base: "column", md: "row" }}>
                <Box color="white" mb={{ base: 4, md: 0 }}>
                  <Heading size="lg" mb={2}>
                    Ready to Proceed?
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Secure your service with easy payment
                  </Text>
                </Box>
                <MotionButton
                  onClick={onOpen}
                  colorScheme="whiteAlpha"
                  size="lg"
                  rightIcon={<Icon as={FaCreditCard} />}
                  leftIcon={<Icon as={FaShieldAlt} />}
                  _hover={{ bg: "whiteAlpha.300" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  fontSize="xl"
                  py={6}
                  px={8}
                >
                  Proceed to Payment
                </MotionButton>
              </Flex>
            </MotionBox>
          </CardBody>
        </Card>
      </MotionBox>

      {/* Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text mb={4}>Please select your payment method:</Text>
              <SimpleGrid columns={2} spacing={4}>
                <Button leftIcon={<FaCreditCard />} variant="outline">
                  Credit Card
                </Button>
                <Button leftIcon={<FaPaypal />} variant="outline">
                  PayPal
                </Button>
                <Button leftIcon={<FaApplePay />} variant="outline">
                  Apple Pay
                </Button>
                <Button leftIcon={<FaGooglePay />} variant="outline">
                  Google Pay
                </Button>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Card Number</FormLabel>
                <Input placeholder="1234 5678 9012 3456" />
              </FormControl>
              <FormControl>
                <FormLabel>Expiration Date</FormLabel>
                <Input placeholder="MM/YY" />
              </FormControl>
              <FormControl>
                <FormLabel>CVV</FormLabel>
                <Input placeholder="123" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green">Process Payment</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default ServiceDetails

