import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
  Outlet,
  Link,
} from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  Button,
  Text,
  Heading,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  ChakraProvider,
  Spinner,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut } from "lucide-react";
import axios from "axios";

const MotionBox = motion(Box);

const UserDashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext();
  const [activeMenuItem, setActiveMenuItem] = useState("Explore Services"); // Default to first link
  const [username, setUsername] = useState("");

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");

  const navLinks = [
    { path: `/user-dashboard/${userId}/services`, label: "Explore Services" },
    { path: `/user-dashboard/${userId}/bookings`, label: "Booking History" },
    { path: `/user-dashboard/${userId}/wishlist`, label: "Wishlist" },
    { path: `/user-dashboard/${userId}/profile`, label: "Profile" },
    { path: `/user-dashboard/${userId}/notifications`, label: "Notifications" },
  ];

  // Redirect if userId does not match
  useEffect(() => {
    if (routeUserId !== userId) {
      navigate("/login", { replace: true });
    }
  }, [routeUserId, userId, navigate]);

  // Fetch Username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5678/auth/${userId}`
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchUsername();
  }, [userId]);

  // Loader for incorrect route
  if (routeUserId !== userId) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bg={bgColor}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </MotionBox>
      </Flex>
    );
  }

  const handleMenuItemClick = (text, path) => {
    setActiveMenuItem(text);
    navigate(path);
    setDrawerOpen(false);
  };

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  return (
    <ChakraProvider>
      <Flex minHeight="100vh" bg={bgColor}>
        {/* Sidebar for larger screens */}
        <MotionBox
          as="aside"
          display={{ base: "none", lg: "flex" }}
          flexDirection="column"
          width="64"
          bg={sidebarBg}
          boxShadow="lg"
          initial={{ x: -64 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UserSidebarContent
            activeMenuItem={activeMenuItem}
            handleMenuItemClick={handleMenuItemClick}
            navLinks={navLinks}
            username={username}
          />
        </MotionBox>

        {/* Main content */}
        <Box flex={1}>
          <Box
            as="header"
            bg={sidebarBg}
            boxShadow="sm"
            display={{ base: "block", lg: "none" }}
          >
            <Flex px={4} py={3}>
              <IconButton
                aria-label="Open menu"
                icon={<Menu />}
                onClick={toggleDrawer}
                variant="ghost"
              />
            </Flex>
          </Box>

          <Box as="main" p={6}>
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeMenuItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </MotionBox>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Mobile drawer */}
        <Drawer isOpen={isDrawerOpen} placement="left" onClose={toggleDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <UserSidebarContent
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
                navLinks={navLinks}
                username={username}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </ChakraProvider>
  );
};

// ** User Sidebar Component **
const UserSidebarContent = ({
  activeMenuItem,
  handleMenuItemClick,
  navLinks,
  username,
}) => (
  <VStack spacing={4} align="stretch" height="full">
    <Box p={6}>
      <Flex alignItems="center" spacing={4}>
        <Box>
          <Heading size="md" color="gray.800">
            Welcome,
          </Heading>
          <Text fontSize="sm" fontWeight="medium" color="blue.600">
            {`${(username || "User").toUpperCase()}!`}
          </Text>
        </Box>
      </Flex>
    </Box>
    <VStack as="nav" spacing={2} px={4} flex={1}>
      {navLinks.map((item, index) => (
        <Button
          key={index}
          leftIcon={null}
          variant="ghost"
          justifyContent="flex-start"
          width="full"
          py={3}
          px={4}
          borderRadius="lg"
          bg={activeMenuItem === item.label ? "blue.100" : "transparent"}
          color={activeMenuItem === item.label ? "blue.600" : "gray.600"}
          _hover={{
            bg: "blue.50",
            color: "blue.600",
          }}
          onClick={() => handleMenuItemClick(item.label, item.path)}
        >
          {item.label}
        </Button>
      ))}
    </VStack>
    <Box p={4} borderTopWidth={1} borderColor="gray.200">
      <Button
        as={Link}
        to="/logout"
        width="full"
        colorScheme="red"
        leftIcon={<LogOut />}
      >
        Logout
      </Button>
    </Box>
  </VStack>
);

export default UserDashboard;
