import React from "react"
import { Box, Heading, Text, Container, Button, VStack } from "@chakra-ui/react"

const HeroSection = ({ category }) => {
  return (
    <Box
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      color="white"
      py={20}
      backgroundImage="url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')"
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.5)"
        backdropFilter="blur(2px)"
      />
      <Container maxW="6xl" position="relative" zIndex={1}>
        <VStack spacing={6} align="center" textAlign="center">
          <Heading as="h1" size="3xl" fontWeight="bold" textShadow="2px 2px 4px rgba(0,0,0,0.4)">
            Find Your Perfect {category || "Service"}
          </Heading>
          <Text fontSize="xl" maxW="2xl" textShadow="1px 1px 2px rgba(0,0,0,0.4)">
            Browse through our extensive list of professional services and book your appointment today.
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.3s"
            fontWeight="bold"
          >
            Get Started
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default HeroSection

