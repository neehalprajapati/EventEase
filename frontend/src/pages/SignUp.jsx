import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  Radio,
  RadioGroup,
  Select,
  Textarea,
  useColorModeValue,
  Stack,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  useToast,
  Image,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

export default function SignupPage() {
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer',
    serviceType: '',
    location: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const inputBgColor = useColorModeValue('gray.100', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRoleChange = (value) => {
    setFormValues((prev) => ({ ...prev, role: value, serviceType: '', location: '', description: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formValues);

    try {
      const response = await axios.post('https://eventease-1-bxq5.onrender.com/api/auth/register', formValues);

      if (response.status === 200) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Occasion Orbit. You can now log in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response?.data?.message || "An error occurred. Please try again.",
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
          borderColor={useColorModeValue('purple.200', 'purple.700')}
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
                Join Occasion Orbit
              </Heading>
              <Text fontSize="md" color="gray.500" mt={2}>
                Plan your perfect event with us
              </Text>
            </Flex>

            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="purple.400" />
                </InputLeftElement>
                <Input
                  name="username"
                  placeholder="Enter your username"
                  value={formValues.username}
                  onChange={handleChange}
                  bg={inputBgColor}
                  borderColor="purple.200"
                  _hover={{ borderColor: 'purple.300' }}
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
                />
              </InputGroup>
            </FormControl>

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
                  _hover={{ borderColor: 'purple.300' }}
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
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
                  _hover={{ borderColor: 'purple.300' }}
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
                />
              </InputGroup>
            </FormControl>

            <FormControl as="fieldset" isRequired>
              <FormLabel as="legend">I am a...</FormLabel>
              <RadioGroup defaultValue="customer" onChange={handleRoleChange}>
                <Stack direction="row" spacing={6}>
                  <Radio value="customer" colorScheme="purple">Event Planner</Radio>
                  <Radio value="service" colorScheme="purple">Service Provider</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {formValues.role === 'service' && (
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    name="serviceType"
                    placeholder="Select your service type"
                    value={formValues.serviceType}
                    onChange={handleChange}
                    bg={inputBgColor}
                    borderColor="purple.200"
                    _hover={{ borderColor: 'purple.300' }}
                    _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
                    icon={<Icon as={FaCalendarAlt} color="purple.400" />}
                  >
                    <option value="hall">Event Hall</option>
                    <option value="catering">Catering Service</option>
                    <option value="decoration">Decoration Service</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaMapMarkerAlt} color="purple.400" />
                    </InputLeftElement>
                    <Input
                      name="location"
                      placeholder="Enter your service location"
                      value={formValues.location}
                      onChange={handleChange}
                      bg={inputBgColor}
                      borderColor="purple.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" height="100%">
                      <Icon as={FaClipboardList} color="purple.400" mt={2} />
                    </InputLeftElement>
                    <Textarea
                      name="description"
                      placeholder="Describe your services"
                      rows={4}
                      value={formValues.description}
                      onChange={handleChange}
                      bg={inputBgColor}
                      borderColor="purple.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px purple.400' }}
                      pl={10}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
            )}

            <Button
              colorScheme="purple"
              size="lg"
              width="full"
              type="submit"
              isLoading={isLoading}
              loadingText="Creating Account"
            >
              Sign Up
            </Button>

            <Flex justify="center" align="center">
              <Text mr={2}>Already have an account?</Text>
              <Link color="purple.500" as={Link} to="/login" fontWeight="medium" onClick={handleLogin} >
                Log in here
              </Link>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
