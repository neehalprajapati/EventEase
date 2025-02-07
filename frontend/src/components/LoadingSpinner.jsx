import React from "react"
import { Flex, Spinner, Text } from "@chakra-ui/react"

const LoadingSpinner = () => {
  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
      <Text mt={4} fontSize="xl" fontWeight="medium">
        Loading services...
      </Text>
    </Flex>
  )
}

export default LoadingSpinner

