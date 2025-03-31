import React from 'react'
import {
  Box,
  Flex,
  Button,
  HStack,
  Text,
  useDisclosure,
  IconButton,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/auth/authSlice'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const buttonHoverBg = useColorModeValue('purple.50', 'purple.700')
  const logoColor = useColorModeValue('purple.600', 'purple.400')

  const handleSignup = () => {
    navigate('/register')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleHome = () => {
    navigate('/')
  }

  const handleAbout = () => {
    navigate('/about')
  }

  const handleContact = () => {
    navigate('/contact')
  }

  const NavButton = ({ children, onClick }) => (
    <Button
      variant="ghost"
      px={4}
      py={2}
      fontSize="md"
      fontWeight="medium"
      color={useColorModeValue('gray.700', 'gray.200')}
      _hover={{
        bg: buttonHoverBg,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease',
      }}
      _active={{
        bg: 'purple.100',
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  )

  return (
    <Box
      as="nav"
      bg={bgColor}
      boxShadow="sm"
      position="fixed"
      width="full"
      zIndex="banner"
      borderBottom="1px"
      borderColor={borderColor}
      transition="all 0.3s ease"
    >
      <Container maxW="7xl">
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          padding={{ base: '1rem', md: '1.5rem' }}
        >
          <Flex align="center" mr={5}>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              color={logoColor}
              letterSpacing="tight"
              cursor="pointer"
              onClick={handleHome}
              _hover={{
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              }}
            >
              Event Ease
            </Text>
          </Flex>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <NavButton onClick={handleHome}>Home</NavButton>
            <NavButton onClick={handleAbout}>About Us</NavButton>
            <NavButton onClick={handleContact}>Contact</NavButton>
          </HStack>

          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            {isAuthenticated ? (
              <Button
                colorScheme="purple"
                variant="outline"
                size="md"
                fontWeight="medium"
                onClick={handleLogout}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                colorScheme="purple"
                size="md"
                fontWeight="medium"
                onClick={handleSignup}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
              >
                Book Now
              </Button>
            )}
          </HStack>

          {/* Mobile Navigation Icon */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
            _hover={{ bg: buttonHoverBg }}
          />
        </Flex>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <Box
            pb={4}
            display={{ md: 'none' }}
            borderTop="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="stretch" px={2}>
              <NavButton onClick={handleHome}>Home</NavButton>
              <NavButton onClick={handleAbout}>About Us</NavButton>
              <NavButton onClick={handleContact}>Contact</NavButton>
              {isAuthenticated ? (
                <Button
                  colorScheme="purple"
                  variant="outline"
                  size="md"
                  fontWeight="medium"
                  width="full"
                  onClick={handleLogout}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  colorScheme="purple"
                  size="md"
                  fontWeight="medium"
                  width="full"
                  onClick={handleSignup}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                >
                  Book Now
                </Button>
              )}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Navbar