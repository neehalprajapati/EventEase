import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Badge,
} from "@chakra-ui/react"
import { FaCalendarCheck, FaUtensils, FaGem } from "react-icons/fa"
import { useNavigate } from "react-router-dom"


export default function Home() {
  const bgColor = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.600", "gray.200")
  const headingColor = useColorModeValue("gray.800", "white")
  const accentColor = useColorModeValue("purple.500", "purple.300")
  const navigate = useNavigate()

  const handleSign = () => {
    navigate("/register")
  }
  return (
    <Box bg={bgColor}>
      {/* Hero Section */}
      <Box position="relative" h={{ base: "90vh", md: "80vh" }} overflow="hidden">
        <Box position="absolute" top="0" left="0" w="full" h="full" zIndex="0">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
            alt="Elegant hall setup"
            objectFit="cover"
            w="full"
            h="full"
            filter="brightness(0.7)"
          />
        </Box>

        <Container maxW="container.xl" position="relative" zIndex="1" h="full">
          <Flex
            direction="column"
            alignItems={{ base: "center", md: "flex-start" }}
            justifyContent="center"
            h="full"
            color="white"
            px={{ base: 4, md: 8 }}
          >
            <Badge colorScheme="purple" fontSize="md" px={3} py={1} mb={4} borderRadius="full">
              Premium Booking Services
            </Badge>
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              maxW={{ base: "100%", md: "70%", lg: "60%" }}
              textAlign={{ base: "center", md: "left" }}
              mb={4}
            >
              Your One-Stop Solution for Event Bookings
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              maxW={{ base: "100%", md: "70%", lg: "50%" }}
              textAlign={{ base: "center", md: "left" }}
              mb={8}
            >
              Effortlessly book halls, decorations, and catering services for your special occasions. We make event
              planning simple and stress-free.
            </Text>
            <HStack spacing={4}>
              <Button size="lg" colorScheme="purple" px={8} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} onClick={handleSign} >
                Book Now
              </Button>
              <Button size="lg" variant="outline" colorScheme="white" px={8} _hover={{ bg: "whiteAlpha.200" }}>
                Explore Services
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              Our Premium Services
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="container.md">
              We offer comprehensive booking solutions for all your event needs, from venue selection to catering and
              decorations.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            {/* Hall Booking */}
            <ServiceCard
              title="Hall Booking"
              description="Choose from our selection of premium venues for your events. From intimate gatherings to grand celebrations, we have the perfect space."
              imageUrl="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              icon={FaCalendarCheck}
              viewMoreLink="View Halls →"
            />

            {/* Decoration Services */}
            <ServiceCard
              title="Decoration Services"
              description="Transform your venue with our stunning decoration packages. Our expert designers create beautiful settings for any occasion."
              imageUrl="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              icon={FaGem}
              viewMoreLink="Explore Decorations →"
            />

            {/* Catering Services */}
            <ServiceCard
              title="Catering Services"
              description="Delight your guests with exquisite cuisine. Our catering partners offer diverse menus to suit all tastes and dietary requirements."
              imageUrl="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              icon={FaUtensils}
              viewMoreLink="View Catering Options →"
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* How It Works Section */}
      <Box bg={useColorModeValue("gray.50", "gray.900")} py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color={headingColor}>
                How It Works
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="container.md">
                Our simple booking process makes planning your event effortless
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} w="full">
              {steps.map((step, index) => (
                <VStack key={index} spacing={4} align="center">
                  <Flex
                    w={12}
                    h={12}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={accentColor}
                    color="white"
                  >
                    <Text fontWeight="bold" fontSize="xl">
                      {index + 1}
                    </Text>
                  </Flex>
                  <Heading as="h3" size="md" textAlign="center" color={headingColor}>
                    {step.title}
                  </Heading>
                  <Text textAlign="center" color={textColor}>
                    {step.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>

            <Button
              size="lg"
              colorScheme="purple"
              px={8}
              mt={8}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              onClick={handleSign}
            >
              Start Booking Now
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              What Our Customers Say
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="container.md">
              Don't just take our word for it - hear from some of our satisfied customers
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            {testimonials.map((testimonial, index) => (
              <VStack
                key={index}
                p={8}
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.700")}
                boxShadow="md"
                spacing={4}
                align="flex-start"
              >
                <Text fontSize="lg" fontStyle="italic" color={textColor}>
                  "{testimonial.text}"
                </Text>
                <HStack spacing={4}>
                  <Image
                    borderRadius="full"
                    boxSize="50px"
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                  />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="bold" color={headingColor}>
                      {testimonial.name}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {testimonial.event}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg={useColorModeValue("purple.50", "purple.900")} py={16}>
        <Container maxW="container.xl">
          <Stack direction={{ base: "column", md: "row" }} spacing={10} align="center" justify="space-between">
            <VStack spacing={4} align={{ base: "center", md: "flex-start" }} maxW={{ base: "full", md: "60%" }}>
              <Heading as="h2" size="xl" color={headingColor} textAlign={{ base: "center", md: "left" }}>
                Ready to Plan Your Perfect Event?
              </Heading>
              <Text fontSize="lg" color={textColor} textAlign={{ base: "center", md: "left" }}>
                Book your hall, decorations, and catering services today and let us handle the details while you enjoy
                your special occasion.
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  size="lg"
                  colorScheme="purple"
                  px={8}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                >
                  Book Now
                </Button>
                <Button size="lg" variant="outline" colorScheme="purple" px={8}>
                  Contact Us
                </Button>
              </HStack>
            </VStack>
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              alt="Event planning"
              borderRadius="lg"
              maxW={{ base: "full", md: "300px" }}
              boxShadow="lg"
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

// Data for the steps section
const steps = [
  {
    title: "Choose Services",
    description: "Select the services you need: hall booking, decorations, catering, or all three.",
  },
  {
    title: "Select Date & Time",
    description: "Pick your preferred date and time for your event from our availability calendar.",
  },
  {
    title: "Customize Options",
    description: "Personalize your selections with our wide range of themes, menus, and decoration options.",
  },
  {
    title: "Confirm & Pay",
    description: "Review your choices, make the payment, and receive instant confirmation.",
  },
]

// Data for testimonials
const testimonials = [
  {
    text: "The booking process was incredibly smooth. The hall was beautiful, decorations were exactly as I wanted, and the food was delicious. Highly recommend!",
    name: "Sarah Johnson",
    event: "Wedding Ceremony",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    text: "We booked the complete package for our corporate event. The team was professional, responsive, and delivered beyond our expectations.",
    name: "Michael Chen",
    event: "Annual Corporate Gala",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
  {
    text: "The catering service was outstanding! Our guests couldn't stop talking about how delicious the food was. Will definitely use again.",
    name: "Priya Patel",
    event: "Birthday Celebration",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  },
]

function ServiceCard({
  title,
  description,
  imageUrl,
  icon,
  viewMoreLink,
}) {
  const bgColorValue = useColorModeValue("white", "gray.700")
  const shadowColorValue = useColorModeValue("md", "md-dark")
  const iconBgColorValue = useColorModeValue("purple.100", "purple.900")
  const headingColorValue = useColorModeValue("gray.800", "white")
  const textColorValue = useColorModeValue("gray.600", "gray.200")
  const accentColorValue = useColorModeValue("purple.500", "purple.300")

  return (
    <VStack
      p={8}
      borderRadius="lg"
      bg={bgColorValue}
      boxShadow={shadowColorValue}
      spacing={4}
      align="flex-start"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
    >
      <Flex w={16} h={16} align="center" justify="center" borderRadius="full" bg={iconBgColorValue} color={accentColorValue}>
        <Icon as={icon} w={8} h={8} />
      </Flex>
      <Heading as="h3" size="md" color={headingColorValue}>
        {title}
      </Heading>
      <Text color={textColorValue}>{description}</Text>
      <Image src={imageUrl || "/placeholder.svg"} alt={title} borderRadius="md" w="full" h={48} objectFit="cover" />
      <Button variant="ghost" colorScheme="purple" alignSelf="flex-start">
        {viewMoreLink}
      </Button>
    </VStack>
  )
}