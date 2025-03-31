import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  useColorModeValue,
  Input,
  IconButton,
  Link,
  VStack,
  Button,
  Heading,
  Image,
} from "@chakra-ui/react"
import { FaYoutube, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa"
import { BiMailSend } from "react-icons/bi"
import { RxDiscordLogo } from "react-icons/rx"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const primaryColor = useColorModeValue("purple.600", "purple.300")
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const newsletterBg = useColorModeValue("purple.50", "purple.900")
  const inputBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.600", "gray.300")

  const SocialButton = ({ icon, label, href, color }) => {
    return (
      <IconButton
        aria-label={label}
        icon={icon}
        size="lg"
        color="white"
        bg={color}
        rounded="full"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "xl",
          opacity: 0.9,
        }}
        _active={{
          transform: "scale(0.95)",
        }}
        transition="all 0.3s ease"
        as="a"
        href={href}
        target="_blank"
      />
    )
  }

  return (
    <Box bg={bgColor} color={useColorModeValue("gray.700", "gray.200")}>
      {/* Newsletter Section with Gradient */}
      <Box
        bg={newsletterBg}
        py={16}
        mb={8}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "linear(to-r, purple.500, pink.500)",
          opacity: 0.1,
        }}
      >
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center">
            <Heading
              size="xl"
              color={primaryColor}
              bgGradient="linear(to-r, purple.500, pink.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Stay Connected with Event Ease
            </Heading>
            <Text fontSize="lg" maxW="2xl">
              Subscribe to receive exclusive updates about new features, special offers, and upcoming events
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              w={{ base: "full", md: "container.md" }}
            >
              <Input
                placeholder="Enter your email"
                size="lg"
                bg={inputBg}
                border="2px"
                borderColor={borderColor}
                _focus={{
                  borderColor: primaryColor,
                  boxShadow: "0 0 0 1px " + primaryColor,
                }}
                _hover={{
                  borderColor: primaryColor,
                }}
                fontSize="md"
                h="60px"
                rounded="full"
              />
              <Button
                leftIcon={<BiMailSend size="24px" />}
                colorScheme="purple"
                size="lg"
                px={8}
                h="60px"
                rounded="full"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                fontWeight="bold"
                fontSize="md"
              >
                Subscribe Now
              </Button>
            </Flex>
          </VStack>
        </Container>
      </Box>

      <Container maxW="6xl" py={14}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10}>
          {/* Quick Links */}
          <VStack align="flex-start" spacing={4}>
            <Text
              color={primaryColor}
              fontWeight="bold"
              fontSize="lg"
              borderBottom="2px"
              borderColor={primaryColor}
              pb={2}
              w="full"
            >
              Explore
            </Text>
            {["About Us", "Our Services", "Latest Events", "Contact"].map((text) => (
              <Link
                key={text}
                href="#"
                _hover={{
                  color: primaryColor,
                  textDecoration: "none",
                  transform: "translateX(5px)",
                }}
                transition="all 0.3s ease"
                fontSize="md"
              >
                {text}
              </Link>
            ))}
          </VStack>

          {/* Support */}
          <VStack align="flex-start" spacing={4}>
            <Text
              color={primaryColor}
              fontWeight="bold"
              fontSize="lg"
              borderBottom="2px"
              borderColor={primaryColor}
              pb={2}
              w="full"
            >
              Support
            </Text>
            {["Help Center", "Terms of Service", "Legal", "Privacy Policy"].map((text) => (
              <Link
                key={text}
                href="#"
                _hover={{
                  color: primaryColor,
                  textDecoration: "none",
                  transform: "translateX(5px)",
                }}
                transition="all 0.3s ease"
                fontSize="md"
              >
                {text}
              </Link>
            ))}
          </VStack>

          {/* Contact with Icons */}
          <VStack align="flex-start" spacing={4}>
            <Text
              color={primaryColor}
              fontWeight="bold"
              fontSize="lg"
              borderBottom="2px"
              borderColor={primaryColor}
              pb={2}
              w="full"
            >
              Contact
            </Text>
            <VStack align="start" spacing={3}>
              <Text fontSize="md">📧 hello@eventease.com</Text>
              <Text fontSize="md">📞 +1 (555) 123-4567</Text>
              <Text fontSize="md">📍 123 Event Street</Text>
              <Text fontSize="md">🌆 New York, NY 10001</Text>
            </VStack>
          </VStack>

          {/* Get The App */}
          <VStack align="flex-start" spacing={4}>
            <Text
              color={primaryColor}
              fontWeight="bold"
              fontSize="lg"
              borderBottom="2px"
              borderColor={primaryColor}
              pb={2}
              w="full"
            >
              Get The App
            </Text>
            <Button
              variant="solid"
              colorScheme="purple"
              leftIcon={<FaGithub />}
              size="lg"
              w="full"
              rounded="full"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              fontWeight="bold"
            >
              Download Now
            </Button>
            <Text fontSize="sm" color={textColor}>
              Available for iOS and Android
            </Text>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* Bottom Bar with Gradient Border */}
      <Box
        borderTopWidth={2}
        borderStyle="solid"
        borderColor={borderColor}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "-2px",
          left: 0,
          right: 0,
          height: "2px",
          bgGradient: "linear(to-r, purple.500, pink.500)",
        }}
      >
        <Container
          maxW="6xl"
          py={8}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={6}
        >
          <Text fontSize="md" fontWeight="medium">
            © {currentYear} Event Ease • All rights reserved
          </Text>

          <Stack direction="row" spacing={6}>
            <SocialButton
              icon={
                <Text fontWeight="bold" fontSize="lg">
                  𝕏
                </Text>
              }
              label="X (formerly Twitter)"
              href="#"
              color="gray.800"
            />
            <SocialButton
              icon={<FaLinkedin size="22px" />}
              label="LinkedIn"
              href="#"
              color="blue.600"
            />
            <SocialButton
              icon={<FaInstagram size="22px" />}
              label="Instagram"
              href="#"
              color="pink.600"
            />
            <SocialButton
              icon={<RxDiscordLogo size="22px" />}
              label="Discord"
              href="#"
              color="purple.500"
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}