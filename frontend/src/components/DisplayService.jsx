import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Heading,
  InputGroup,
  InputLeftElement,
  Flex,
  Fade,
  ScaleFade,
  useDisclosure,
  SlideFade,
  Image,
  Icon,
} from "@chakra-ui/react"
import { MagnifyingGlassIcon, MapPinIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import ServiceCard from "./ServiceCard"
import HeroSection from "./HeroSection"
import LoadingSpinner from "./LoadingSpinner"
import ErrorAlert from "./ErrorAlert"

const DisplayService = ({ category }) => {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [filteredServices, setFilteredServices] = useState([])
  const [servicesData, setServicesData] = useState([])
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const apiUrl = `https://eventease-1-bxq5.onrender.com/auth/${category}-service`

  const bgColor = useColorModeValue("gray.50", "gray.900")
  const cardBgColor = useColorModeValue("white", "gray.800")
  const inputBgColor = useColorModeValue("gray.100", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const primaryColor = "teal.500"
  const secondaryColor = "purple.500"

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }
        const data = await response.json()
        setServicesData(data)
        setFilteredServices(data)
        onOpen()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [apiUrl, onOpen])

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearch(query)

    if (query.trim() === "") {
      setFilteredSuggestions([])
    } else {
      const suggestions = servicesData
        .filter((service) => service.serviceName.toLowerCase().includes(query))
        .slice(0, 5)
      setFilteredSuggestions(suggestions)
    }
  }

  const handleSuggestionClick = (name) => {
    setSearch(name)
    setFilteredSuggestions([])
  }

  const handleSearch = () => {
    const filtered = servicesData.filter((service) => {
      const matchesCategory = !category || service.serviceType === category
      const matchesName = service.serviceName.toLowerCase().includes(search.toLowerCase())
      const matchesLocation = location === "" || service.location === location
      const matchesPrice =
        priceRange === "" ||
        (priceRange === "under500" && service.price < 500) ||
        (priceRange === "500to700" && service.price >= 500 && service.price <= 700) ||
        (priceRange === "above700" && service.price > 700)

      return matchesCategory && matchesName && matchesLocation && matchesPrice
    })

    setFilteredServices(filtered)
    setFilteredSuggestions([])
  }

  const cardBgColorMode = useColorModeValue("white", "gray.800")
  const inputBgColorMode = useColorModeValue("gray.100", "gray.700")
  const borderColorMode = useColorModeValue("gray.200", "gray.600")
  const hoverBgColor = useColorModeValue("gray.100", "gray.700")

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />

  return (
    <Box bg={bgColor} minH="100vh">
      <HeroSection category={category} />
      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">
          <SlideFade in={isOpen} offsetY="20px">
            <Heading as="h2" size="2xl" textAlign="center" mb={4} color={primaryColor}>
              Discover Your Perfect {category || "Service"}
            </Heading>
            <Text fontSize="xl" textAlign="center" color={secondaryColor} mb={8}>
              Find top-rated professionals in your area
            </Text>
          </SlideFade>
          <Box
            position="relative"
            transition="all 0.3s ease-in-out"
            bg={cardBgColor}
            borderRadius="xl"
            boxShadow="xl"
            p={6}
          >
            <VStack spacing={4}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={MagnifyingGlassIcon} color={primaryColor} boxSize={5} />
                </InputLeftElement>
                <Input
                  placeholder="Search by service name..."
                  value={search}
                  onChange={handleSearchChange}
                  borderRadius="full"
                  bg={inputBgColor}
                  _focus={{ boxShadow: `0 0 0 2px ${primaryColor}`, borderColor: primaryColor }}
                  transition="all 0.3s ease-in-out"
                />
              </InputGroup>
              <Flex direction={{ base: "column", md: "row" }} gap={4} w="full">
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MapPinIcon} color={primaryColor} boxSize={5} />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter Location"
                    onChange={(e) => setLocation(e.target.value)}
                    borderRadius="full"
                    bg={inputBgColor}
                    _focus={{ boxShadow: `0 0 0 2px ${primaryColor}`, borderColor: primaryColor }}
                    transition="all 0.3s ease-in-out"
                  />
                </InputGroup>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={CurrencyDollarIcon} color={primaryColor} boxSize={5} />
                  </InputLeftElement>
                  <Select
                    placeholder="Select Price Range"
                    onChange={(e) => setPriceRange(e.target.value)}
                    pl={10}
                    borderRadius="full"
                    bg={inputBgColor}
                    _focus={{ boxShadow: `0 0 0 2px ${primaryColor}`, borderColor: primaryColor }}
                    transition="all 0.3s ease-in-out"
                  >
                    <option value="under500">Under - ₹500</option>
                    <option value="500to700">₹500 - ₹700</option>
                    <option value="above700">Above ₹700</option>
                  </Select>
                </InputGroup>
              </Flex>
              <Button
                colorScheme="teal"
                size="lg"
                onClick={handleSearch}
                borderRadius="full"
                px={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.3s ease-in-out"
                w={{ base: "full", md: "auto" }}
              >
                Search
              </Button>
            </VStack>
            <Fade in={filteredSuggestions.length > 0}>
              <Box
                position="absolute"
                bg={cardBgColorMode}
                w="full"
                mt={2}
                boxShadow="lg"
                borderRadius="md"
                zIndex={10}
                overflow="hidden"
                border="1px solid"
                borderColor={borderColorMode}
                left={0}
              >
                {filteredSuggestions.map((service) => (
                  <Box
                    key={service.id}
                    p={3}
                    borderBottom="1px solid"
                    borderColor={borderColorMode}
                    cursor="pointer"
                    _hover={{ bg: hoverBgColor }}
                    onClick={() => handleSuggestionClick(service.serviceName)}
                    transition="all 0.2s"
                  >
                    {service.serviceName}
                  </Box>
                ))}
              </Box>
            </Fade>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <ScaleFade initialScale={0.9} in={isOpen} delay={index * 0.1} key={service.id}>
                  <ServiceCard service={service} />
                </ScaleFade>
              ))
            ) : (
              <Text fontSize="xl" fontWeight="medium" textAlign="center" gridColumn="1 / -1">
                No services found
              </Text>
            )}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default DisplayService

