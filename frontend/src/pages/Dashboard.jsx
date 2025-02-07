import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
  Outlet,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  UserCircle,
  Eye,
  Bell,
  BarChart2,
  LogOut,
} from "lucide-react";
import axios from "axios";
import {
  ChakraProvider,
  Box,
  Flex,
  VStack,
  Button,
  Text,
  Image,
  Heading,
  useColorModeValue,
  Spinner,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";


const MotionBox = motion(Box);

const MenuItem = ({ icon: Icon, children, isActive, onClick }) => (
  <Button
    leftIcon={<Icon />}
    variant="ghost"
    justifyContent="flex-start"
    width="full"
    py={3}
    px={4}
    borderRadius="lg"
    bg={isActive ? "blue.100" : "transparent"}
    color={isActive ? "blue.600" : "gray.600"}
    _hover={{
      bg: "blue.50",
      color: "blue.600",
    }}
    onClick={onClick}
  >
    {children}
  </Button>
);

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext();
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard Overview");
  const [username, setUsername] = useState('');

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (routeUserId !== userId) {
      navigate("/login", { replace: true });
    }
  }, [routeUserId, userId, navigate]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:5678/auth/${userId}`);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchUsername();
  }, [userId]);

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

  const menuItems = [
    {
      icon: Home,
      text: "Dashboard Overview",
      path: `/dashboard/${userId}/overview`,
    },
    {
      icon: UserCircle,
      text: "Add/Edit Profile",
      path: `/dashboard/${userId}/profile`,
    },
    {
      icon: Eye,
      text: "View My Service",
      path: `/dashboard/${userId}/service-overview`,
    },
    {
      icon: Bell,
      text: "Notifications",
      path: `/dashboard/${userId}/notifications`,
    },
    {
      icon: BarChart2,
      text: "Analytics",
      path: `/dashboard/${userId}/analytics`,
    },
  ];

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
          <SidebarContent
            activeMenuItem={activeMenuItem}
            handleMenuItemClick={handleMenuItemClick}
            menuItems={menuItems}
            userId={userId}
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
              <SidebarContent
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
                menuItems={menuItems}
                userId={userId}
                username={username}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </ChakraProvider>
  );
};

const SidebarContent = ({
  activeMenuItem,
  handleMenuItemClick,
  menuItems,
  userId,
  username
}) => (
  <VStack spacing={4} align="stretch" height="full">
    <Box p={6}>
      <Flex alignItems="center" spacing={4}>
        {/* <Image
          src="/placeholder.svg?height=80&width=80"
          alt="User Avatar"
          boxSize="12"
          borderRadius="full"
          mr={4}
        /> */}
        <Box>
          <Heading size="md" color="gray.800">
            Welcome,
          </Heading>
          <Text fontSize="sm" fontWeight="medium" color="blue.600">
          {`${(username || 'User').toUpperCase()} !.`}
          </Text>
        </Box>
      </Flex>
    </Box>
    <VStack as="nav" spacing={2} px={4} flex={1}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          isActive={activeMenuItem === item.text}
          onClick={() => handleMenuItemClick(item.text, item.path)}
        >
          {item.text}
        </MenuItem>
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

export default Dashboard;
