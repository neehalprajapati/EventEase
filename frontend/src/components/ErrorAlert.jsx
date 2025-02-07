import React from "react"
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from "@chakra-ui/react"

const ErrorAlert = ({ message }) => {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error
        </AlertTitle>
        <AlertDescription maxWidth="sm">{message}</AlertDescription>
      </Alert>
    </Box>
  )
}

export default ErrorAlert

