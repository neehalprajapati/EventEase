import {
    Card,
    CardBody,
    CardHeader,
    VStack,
    Heading,
    Box,
    Flex,
    Text,
    Badge,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const PackageSelectionCard = ({
    service,
    onPackageSelect,
    selectedPackage,
  }) => {
    const [people, setPeople] = useState(1);
    const isCatering = service.serviceType === "catering";
    
    // Add color mode values
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const hoverBg = useColorModeValue("blue.50", "blue.900");
    const textColor = useColorModeValue("gray.600", "gray.300");
  
    return (
      <Card bg={cardBg} borderRadius="md" mt={4} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <Heading size="md">Select Package</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {(
              (isCatering
                ? service.cateringPackages
                : service.decorationPackages) || []
            ).map((pkg, index) => (
              <Box
                key={index}
                p={4}
                border="1px solid"
                borderColor={selectedPackage === pkg ? "blue.500" : borderColor}
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.3s"
                bg={selectedPackage === pkg ? hoverBg : cardBg}
                onClick={() => onPackageSelect(pkg, people)}
                _hover={{
                  borderColor: "blue.300",
                  transform: "translateY(-2px)",
                  shadow: "md",
                }}
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {pkg.packageName}
                    </Text>
                    <Text color={textColor} fontSize="sm">
                      {pkg.packageDescription}
                    </Text>
                  </VStack>
                  <Badge colorScheme="blue" fontSize="lg" p={2} borderRadius="md">
                    ₹{isCatering ? pkg.pricePerPerson : pkg.packagePrice}
                    {isCatering && " per person"}
                  </Badge>
                </Flex>
              </Box>
            ))}
  
            {/* Show default price option if no packages are available */}
            {(!service.cateringPackages?.length &&
              !service.decorationPackages?.length) && (
              <Box
                p={4}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
              >
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">Standard Price</Text>
                  <Badge colorScheme="blue" fontSize="lg" p={2}>
                    ₹{service.price}
                  </Badge>
                </Flex>
              </Box>
            )}
  
            {/* People count input for catering */}
            {isCatering && selectedPackage && (
              <FormControl>
                <FormLabel>Number of People</FormLabel>
                <NumberInput
                  min={1}
                  value={people}
                  onChange={(valueString) => {
                    const value = parseInt(valueString);
                    setPeople(value);
                    onPackageSelect(selectedPackage, value);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };
  
  export default PackageSelectionCard;