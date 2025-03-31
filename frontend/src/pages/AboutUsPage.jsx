import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react"
import { FaCalendar, FaPalette, FaUtensils, FaClock, FaCheckCircle, FaShieldAlt } from "react-icons/fa"

const Feature = ({ title, text, icon }) => {
  return (
    <Stack direction={"row"} align={"center"}>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("purple.500", "purple.300")}
        mb={1}
      >
        {icon}
      </Flex>
      <Stack direction={"column"} align={"start"} spacing={0}>
        <Text fontWeight={600}>{title}</Text>
        <Text color={"gray.600"}>{text}</Text>
      </Stack>
    </Stack>
  )
}

export default function AboutUsPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue("purple.50", "gray.900")} color={useColorModeValue("gray.700", "gray.200")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={"center"}>
            <Heading
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
              textAlign={"center"}
            >
              Your One-Stop{" "}
              <Text as={"span"} color={"purple.500"}>
                Event Booking Solution
              </Text>
            </Heading>
            <Text color={"gray.500"} maxW={"3xl"} fontSize={"xl"} textAlign={"center"} mt={6}>
              Simplify your event planning with our comprehensive booking system for halls, decorations, and catering
              services.
            </Text>
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} spacing={4} justify={"center"}>
            <Button
              rounded={"full"}
              bg={"purple.500"}
              color={"white"}
              _hover={{
                bg: "purple.600",
              }}
              size={"lg"}
              fontSize={"md"}
              px={8}
            >
              Get Started
            </Button>
            <Button rounded={"full"} size={"lg"} fontSize={"md"} px={8}>
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* About Us Content */}
      <Container maxW={"7xl"} py={16}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={4}>
            <Text
              textTransform={"uppercase"}
              color={"purple.400"}
              fontWeight={600}
              fontSize={"sm"}
              bg={useColorModeValue("purple.50", "purple.900")}
              p={2}
              alignSelf={"flex-start"}
              rounded={"md"}
            >
              Our Story
            </Text>
            <Heading>A modern approach to event planning</Heading>
            <Text color={"gray.500"} fontSize={"lg"}>
              We understand that organizing an event can be overwhelming. That's why we've created a seamless platform
              that brings together all the essential elements of event planning - venue selection, decoration, and
              catering - in one place.
            </Text>
            <Stack spacing={4} divider={<Box borderColor={useColorModeValue("gray.100", "gray.700")} />}>
              <Feature
                icon={<Icon as={FaCalendar} w={5} h={5} />}
                title={"Easy Booking"}
                text={"Effortlessly book halls, decorations, and catering services in just a few clicks."}
              />
              <Feature
                icon={<Icon as={FaClock} w={5} h={5} />}
                title={"Time-Saving"}
                text={"Save hours of planning time with our all-in-one booking system."}
              />
              <Feature
                icon={<Icon as={FaCheckCircle} w={5} h={5} />}
                title={"Quality Assured"}
                text={"We partner with top-rated venues and service providers to ensure the best for your events."}
              />
            </Stack>
          </Stack>
          <Flex>
            <Image
              rounded={"md"}
              alt={"feature image"}
              src={
                "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" ||
                "/placeholder.svg"
              }
              objectFit={"cover"}
            />
          </Flex>
        </SimpleGrid>
      </Container>

      {/* Services Section */}
      <Box bg={useColorModeValue("gray.100", "gray.700")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={"center"}>
            <Heading>Our Comprehensive Services</Heading>
            <Text color={"gray.500"} fontSize={"lg"} textAlign={"center"} mt={2}>
              Everything you need for a successful event, all in one place
            </Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <VStack align={"start"} bg={"white"} rounded={"xl"} p={6} shadow={"md"}>
              <Icon as={FaCalendar} w={10} h={10} color={"purple.500"} />
              <Heading size={"md"}>Hall Booking</Heading>
              <Text color={"gray.600"}>
                Choose from a wide selection of venues perfect for any occasion, from intimate gatherings to grand
                celebrations.
              </Text>
            </VStack>
            <VStack align={"start"} bg={"white"} rounded={"xl"} p={6} shadow={"md"}>
              <Icon as={FaPalette} w={10} h={10} color={"purple.500"} />
              <Heading size={"md"}>Decoration Services</Heading>
              <Text color={"gray.600"}>
                Transform your chosen venue with our stunning decoration packages, tailored to your event's theme and
                style.
              </Text>
            </VStack>
            <VStack align={"start"} bg={"white"} rounded={"xl"} p={6} shadow={"md"}>
              <Icon as={FaUtensils} w={10} h={10} color={"purple.500"} />
              <Heading size={"md"}>Catering Services</Heading>
              <Text color={"gray.600"}>
                Delight your guests with exquisite cuisine from our network of top-rated catering partners.
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW={"7xl"} py={16}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align={"center"}
          justify={"space-between"}
          bg={useColorModeValue("purple.50", "purple.900")}
          p={8}
          rounded={"xl"}
        >
          <Stack spacing={0} align={"start"} maxW={"lg"}>
            <Heading fontSize={"3xl"}>Ready to simplify your event planning?</Heading>
            <Text fontSize={"lg"} color={"gray.500"} mt={2}>
              Join thousands of satisfied customers who have transformed their events with our booking system.
            </Text>
          </Stack>
          <Button
            rounded={"full"}
            bg={"purple.500"}
            color={"white"}
            _hover={{
              bg: "purple.600",
            }}
            size={"lg"}
            fontSize={"md"}
            px={8}
          >
            Get Started Now
          </Button>
        </Stack>
      </Container>

      {/* Trust and Security Section */}
      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={"center"}>
            <Heading>Trust and Security</Heading>
            <Text color={"gray.500"} fontSize={"lg"} textAlign={"center"} mt={2}>
              Your peace of mind is our top priority
            </Text>
          </Stack>
          <HStack spacing={10} align={"top"} justify={"center"} wrap={"wrap"}>
            <Feature
              icon={<Icon as={FaShieldAlt} w={10} h={10} />}
              title={"Secure Payments"}
              text={"Your transactions are protected with industry-standard encryption."}
            />
            <Feature
              icon={<Icon as={FaCheckCircle} w={10} h={10} />}
              title={"Verified Providers"}
              text={"All our service providers are thoroughly vetted and regularly reviewed."}
            />
            <Feature
              icon={<Icon as={FaClock} w={10} h={10} />}
              title={"24/7 Support"}
              text={"Our customer support team is always available to assist you."}
            />
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}

