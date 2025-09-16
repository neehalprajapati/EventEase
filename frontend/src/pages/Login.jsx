import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useToast,
  Image,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { login } from "../reducers/auth/authSlice";

// ✅ import socket.io-client
import { io } from "socket.io-client";

export default function LoginPage() {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("purple.600", "purple.300");
  const inputBgColor = useColorModeValue("gray.100", "gray.700");

  // ✅ initialize socket connection
  const socket = io("http://localhost:7799", {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false, // connect only after login
  });

  useEffect(() => {
    // handle global socket events if needed
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSign = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5678/api/auth/login', formValues); // ✅ proxied

      if (response.status === 200) {
        const { token } = response.data;
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userId;

        Cookies.set("token", token, {
          secure: true,
          sameSite: "Strict",
        });

        dispatch(login({ userId, token }));

        toast({
          title: "Login successful!",
          description: "Welcome back to Occasion Orbit!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // ✅ connect socket after login
        socket.connect();
        socket.emit("join", userId);

        try {
          const userRes = await axios.get(`http://localhost:5678/auth/${userId}`); // ✅ proxied
          if (userRes.data.role === "service") {
            navigate(`/dashboard/${userId}/profile`);
          } else if (userRes.data.role === "customer") {
            navigate(`/user-dashboard/${userId}/services`);
          }
        } catch (err) {
          console.error("Redirecting error", err);
        }
      }
    } catch (error) {
      toast({
        title: "Error!",
        description:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      py={12}
      bgImage="url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        backdropFilter="blur(5px)"
      />
      <Container maxW="container.md" position="relative" zIndex={1}>
        <Box
          bg={cardBgColor}
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue("purple.200", "purple.700")}
        >
          <VStack as="form" spacing={8} align="stretch" onSubmit={handleSubmit}>
            <Flex justify="center" align="center" direction="column">
              <Image
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"
                alt="Occasion Orbit Logo"
                mb={4}
                boxSize="80px"
                borderRadius="full"
                objectFit="cover"
              />
              <Heading as="h1" size="xl" textAlign="center" color={headingColor}>
                Log in to Occasion Orbit
              </Heading>
              <Text fontSize="md" color="gray.500" mt={2}>
                Welcome back! Please enter your credentials.
              </Text>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="purple.400" />
                </InputLeftElement>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formValues.email}
                  onChange={handleChange}
                  bg={inputBgColor}
                  borderColor="purple.200"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{
                    borderColor: "purple.400",
                    boxShadow: "0 0 0 1px purple.400",
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="purple.400" />
                </InputLeftElement>
                <Input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formValues.password}
                  onChange={handleChange}
                  bg={inputBgColor}
                  borderColor="purple.200"
                  _hover={{ borderColor: "purple.300" }}
                  _focus={{
                    borderColor: "purple.400",
                    boxShadow: "0 0 0 1px purple.400",
                  }}
                />
              </InputGroup>
            </FormControl>

            <Button
              colorScheme="purple"
              size="lg"
              width="full"
              type="submit"
              isLoading={isLoading}
              loadingText="Logging In"
            >
              Log In
            </Button>

            <Flex justify="center" align="center">
              <Text mr={2}>Don't have an account?</Text>
              <Link
                color="purple.500"
                to="/signup"
                fontWeight="medium"
                onClick={handleSign}
              >
                Sign up here
              </Link>
            </Flex>

            <Flex justify="center" align="center" mt={4}>
              <Text color="gray.500">Or</Text>
            </Flex>
            <Flex justify="center" align="center" direction="column" mt={4}>
              <Button colorScheme="gray" variant="outline" width="full">
                Log in with Google
              </Button>
              <Button colorScheme="gray" variant="outline" width="full" mt={2}>
                Log in with Facebook
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
