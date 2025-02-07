import React from "react"
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  Container,
  Heading,
  Button,
  Flex,
  Badge,
  Tooltip,
} from "@chakra-ui/react"
import { FaConciergeBell, FaBuilding, FaUtensils, FaArrowRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)



const ExploreServices = () => {
  const navigate = useNavigate()
  const bgGradient = useColorModeValue("linear(to-br, blue.50, purple.50)", "linear(to-br, blue.900, purple.900)")
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.700", "gray.200")
  const iconColor = useColorModeValue("blue.500", "blue.300")
  const hoverBg = useColorModeValue("blue.50", "blue.700")

  const {userId} = useSelector((state) => state.auth)

  const innerBg = useColorModeValue("blue.100", "blue.900")
  const serviceOptions = [
    {
      title: "Book Decoration",
      description: "Find expert decorators for weddings, birthdays, and corporate events.",
      icon: FaConciergeBell,
      link: `/user-dashboard/${userId}/services/book-decoration`,
      popular: true,
    },
    {
      title: "Book Hall",
      description: "Browse and book venues for your events based on location and capacity.",
      icon: FaBuilding,
      link:`/user-dashboard/${userId}/services/book-hall`,
    },
    {
      title: "Book Catering Services",
      description: "Hire top-rated catering services for any event, big or small.",
      icon: FaUtensils,
      link: `/user-dashboard/${userId}/services/book-catering`,
      new: true,
    },
  ]

  return (
    <Box bgGradient={bgGradient} minHeight="100vh" py={16} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundImage="url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')"
        opacity={0.1}
      />
      <Container maxW="6xl" zIndex={1} position="relative">
        <VStack spacing={12}>
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="bold"
              textAlign="center"
              color={textColor}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Explore Our Services
            </Heading>
          </MotionBox>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="100%">
            <AnimatePresence>
              {serviceOptions.map((service, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MotionBox
                    bg={cardBg}
                    p={6}
                    borderRadius="xl"
                    boxShadow="xl"
                    cursor="pointer"
                    onClick={() => navigate(service.link)}
                    whileHover={{ scale: 1.05, backgroundColor: hoverBg }}
                    whileTap={{ scale: 0.95 }}
                    position="relative"
                    overflow="hidden"
                  >
                    <VStack spacing={4} align="center">
                      <Box p={3} borderRadius="full" bg={innerBg} position="relative">
                        <Icon as={service.icon} boxSize={8} color={iconColor} />
                        <MotionBox
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          borderRadius="full"
                          border="2px solid"
                          borderColor={iconColor}
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                        />
                      </Box>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {service.title}
                      </Text>
                      <Text fontSize="md" color={textColor} textAlign="center">
                        {service.description}
                      </Text>
                      <Tooltip label="Explore this service" placement="top">
                        <Button rightIcon={<FaArrowRight />} colorScheme="blue" variant="outline" size="sm" mt={2}>
                          Learn More
                        </Button>
                      </Tooltip>
                    </VStack>
                    {service.popular && (
                      <Badge position="absolute" top={2} right={2} colorScheme="green">
                        Popular
                      </Badge>
                    )}
                    {service.new && (
                      <Badge position="absolute" top={2} right={2} colorScheme="purple">
                        New
                      </Badge>
                    )}
                  </MotionBox>
                </MotionBox>
              ))}
            </AnimatePresence>
          </SimpleGrid>
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            justifyContent="center"
          >
            <Button
              size="lg"
              colorScheme="purple"
              rightIcon={<FaArrowRight />}
              onClick={() => navigate("/all-services")}
            >
              View All Services
            </Button>
          </MotionFlex>
        </VStack>
      </Container>
    </Box>
  )
}

export default ExploreServices

