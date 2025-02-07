import React from 'react'
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  useDisclosure,
  IconButton,
  VStack,
} from '@chakra-ui/react'
import { ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/auth/authSlice'
import useAuth from '../hooks/useAuth'


const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isAuthenticated} = useAuth()
  const handleSignup = () => {
    navigate('/register')
  }

  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <Box as="nav" bg="white" boxShadow="sm" position="fixed" width="full" zIndex="banner">
      <Flex align="center" justify="space-between" wrap="wrap" padding="1.5rem" maxW="7xl" mx="auto">
        <Flex align="center" mr={5}>
          <Text fontSize="2xl" fontWeight="bold" color="purple.500">
            Occasion Orbit
          </Text>
        </Flex>

        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <Button variant="ghost">Home</Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
              Book Services
            </MenuButton>
            <MenuList>
              <MenuItem>Book Whole Event</MenuItem>
              <MenuItem>Book Camera</MenuItem>
              <MenuItem>Book Catering</MenuItem>
              <MenuItem>Book Hall</MenuItem>
              <MenuItem>Other Services</MenuItem>
            </MenuList>
          </Menu>
          <Button variant="ghost">About Us</Button>
          <Button variant="ghost">Contact</Button>
        </HStack>

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {isAuthenticated?(
            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
              Profile
            </MenuButton>
            <MenuList>
              <MenuItem>My Bookings</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={handleLogout} >Logout</MenuItem>
            </MenuList>
          </Menu>
          ):null}
          <Button colorScheme="purple" size="md" fontWeight="medium">
            Book Now
          </Button>
        </HStack>

        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onToggle}
          icon={<HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
        />
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }}>
          <VStack spacing={4} align="stretch">
            <Button variant="ghost">Home</Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" width="full">
                Book Services
              </MenuButton>
              <MenuList>
                <MenuItem>Book Whole Event</MenuItem>
                <MenuItem>Book Camera</MenuItem>
                <MenuItem>Book Catering</MenuItem>
                <MenuItem>Book Hall</MenuItem>
                <MenuItem>Other Services</MenuItem>
              </MenuList>
            </Menu>
            <Button variant="ghost">About Us</Button>
            <Button variant="ghost">Contact</Button>
            {isAuthenticated?(
              <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" width="full">
                Profile
              </MenuButton>
              <MenuList>
                <MenuItem>My Bookings</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem onClick={handleLogout} >Logout</MenuItem>
              </MenuList>
            </Menu>
            ):null}
            <Button colorScheme="purple" size="md" fontWeight="medium" width="full" onClick={handleSignup}>
              SignUp
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  )
}

export default Navbar