import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  InputGroup,
  InputLeftAddon,
  FormErrorMessage,
  Textarea,
  Icon,
  HStack,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiImage,
  FiPackage,
  FiTrash2,
  FiPlusCircle,
} from "react-icons/fi";

export default function EnhancedServiceForm() {
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { userId } = useSelector((state) => state.auth);

  // Initialize default values.
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hallDetails: [{}], // For hall service details (as an array with one object)
      // For decoration/catering service availability:
      serviceTimeStart: "",
      serviceTimeEnd: "",
      price: ""
    },
  });

  // We use the serviceType value set via the API (user cannot change it).
  const serviceType = watch("serviceType");

  const {
    fields: decorationPackageFields,
    append: appendDecorationPackage,
    remove: removeDecorationPackage,
  } = useFieldArray({
    control,
    name: "decorationPackages",
  });

  const {
    fields: cateringPackageFields,
    append: appendCateringPackage,
    remove: removeCateringPackage,
  } = useFieldArray({
    control,
    name: "cateringPackages",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5678/auth/${userId}`)
      .then((response) => {
        const userData = response.data;
        Object.keys(userData).forEach((key) => {
          setValue(key, userData[key]);
        });
      })
      .catch((error) => {
        toast({
          title: "Error loading user data.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [userId, setValue, toast]);

  const uploadImagesToCloudinary = async () => {
    const uploadedUrls = [];
    for (const file of images) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          `http://localhost:5678/auth/upload-image/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        uploadedUrls.push(response.data.user.image.slice(-1)[0]);
      } catch (error) {
        toast({
          title: "Error uploading images.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw error;
      }
    }
    return uploadedUrls;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // For decoration & catering, combine the time inputs into serviceTimeRange.
      if (
        (serviceType === "decoration" || serviceType === "catering") &&
        data.serviceTimeStart &&
        data.serviceTimeEnd
      ) {
        data.serviceTimeRange = `${data.serviceTimeStart} - ${data.serviceTimeEnd}`;
      }
      // For hall services, combine hall start and end times into hallTimeRange (keeping individual values).
      if (serviceType === "hall" && data.hallDetails && data.hallDetails[0]) {
        const { hallStartTime, hallEndTime, ...otherDetails } =
          data.hallDetails[0];
        data.hallDetails[0] = {
          ...otherDetails,
          hallStartTime,
          hallEndTime,
          hallTimeRange: `${hallStartTime} - ${hallEndTime}`,
        };
      }
      const response = await axios.get(`http://localhost:5678/auth/${userId}`);
      const existingImages = response.data.image || [];
      const uploadedUrls = await uploadImagesToCloudinary();
      const allImages = [...existingImages, ...uploadedUrls];
      const formData = { ...data, image: allImages };
      await axios.put(`http://localhost:5678/auth/${userId}`, formData);
      toast({
        title: "Form updated.",
        description: "Your service details have been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating service.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      maxWidth="800px"
      margin="auto"
      padding={8}
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
    >
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="blue.500">
          Create Your Service
        </Heading>
        <Text textAlign="center" color="gray.500">
          Please fill in the details of your service below.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {/* User Details Section */}
            <Card bg={cardBg} borderRadius="md">
              <CardHeader>
                <Heading size="md">User Details</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor="username">
                      <HStack>
                        <Icon as={FiUser} />
                        <Text>Username</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      {...register("username", {
                        required: "Username is required",
                      })}
                      readOnly
                      isDisabled
                    />
                    <FormErrorMessage>
                      {errors.username && errors.username.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel htmlFor="email">
                      <HStack>
                        <Icon as={FiMail} />
                        <Text>Email</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      readOnly
                      isDisabled
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Service Details Section */}
            <Card bg={cardBg} borderRadius="md">
              <CardHeader>
                <Heading size="md">Service Details</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.mobileNumber}>
                    <FormLabel htmlFor="mobileNumber">
                      <HStack>
                        <Icon as={FiPhone} />
                        <Text>Mobile Number</Text>
                      </HStack>
                    </FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="+1" />
                      <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder="Enter your mobile number"
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Invalid mobile number",
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.mobileNumber && errors.mobileNumber.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.location}>
                    <FormLabel htmlFor="location">
                      <HStack>
                        <Icon as={FiMapPin} />
                        <Text>Location</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      id="location"
                      placeholder="Enter service location"
                      {...register("location", {
                        required: "Location is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.location && errors.location.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.serviceName}>
                    <FormLabel htmlFor="serviceName">
                      <HStack>
                        <Icon as={FiBriefcase} />
                        <Text>Service Name</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      id="serviceName"
                      placeholder="Enter service name"
                      {...register("serviceName", {
                        required: "Service name is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.serviceName && errors.serviceName.message}
                    </FormErrorMessage>
                  </FormControl>
                  {/*service address*/}
                  <FormControl isInvalid={errors.address}>
                    <FormLabel htmlFor="address">
                      <HStack>
                        <Icon as={FiMapPin} />
                        <Text>Address</Text>
                      </HStack>
                    </FormLabel>
                    <Textarea
                      id="address"
                      placeholder="Enter your address"
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.address && errors.address.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* New Price Field */}
                  <FormControl isInvalid={errors.price}>
                    <FormLabel htmlFor="price">
                      <HStack>

                        <Text> ₹ Price</Text>
                      </HStack>
                    </FormLabel>
                    <NumberInput min={0}>
                      <NumberInputField
                        id="price"
                        placeholder="Enter service price"
                        {...register("price", {
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price must be non-negative",
                          },
                          valueAsNumber: true,
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.price && errors.price.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Display non-editable service type as a badge */}
                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Icon as={FiPackage} />
                        <Text>Service Type</Text>
                      </HStack>
                    </FormLabel>
                    <Badge
                      colorScheme="blue"
                      fontSize="md"
                      p={2}
                      borderRadius="md"
                    >
                      {serviceType
                        ? serviceType.charAt(0).toUpperCase() +
                        serviceType.slice(1)
                        : ""}
                    </Badge>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Hall Details Section (only for hall service) */}
            {serviceType === "hall" && (
              <Card bg={cardBg} borderRadius="md">
                <CardHeader>
                  <Heading size="md">Hall Details</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl isInvalid={errors["hallDetails.0.hallAc"]}>
                      <FormLabel>AC / Non-AC</FormLabel>
                      <Select
                        placeholder="Select option"
                        {...register("hallDetails.0.hallAc", {
                          required: "Please select AC option",
                        })}
                      >
                        <option value="ac">AC</option>
                        <option value="nonAc">Non-AC</option>
                      </Select>
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallAc &&
                          errors.hallDetails[0].hallAc.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors["hallDetails.0.hallCapacity"]}
                    >
                      <FormLabel>Maximum Capacity (people)</FormLabel>
                      <NumberInput min={1}>
                        <NumberInputField
                          placeholder="Enter capacity"
                          {...register("hallDetails.0.hallCapacity", {
                            required: "Capacity is required",
                            min: { value: 1, message: "At least 1 person" },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallCapacity &&
                          errors.hallDetails[0].hallCapacity.message}
                      </FormErrorMessage>
                    </FormControl>

                    {/* Fix in the Hall Details Section */}
                    <FormControl
                      isInvalid={errors["hallDetails.0.hallMaxHours"]}
                    >
                      <FormLabel>Maximum Rental Hours</FormLabel>
                      <NumberInput min={1}>
                        <NumberInputField
                          placeholder="Enter max rental hours"
                          {...register("hallDetails.0.hallMaxHours", {
                            required: "Maximum rental hours required",
                            min: { value: 1, message: "At least 1 hour" },
                            validate: (value, formValues) => {
                              const minHours = parseInt(
                                formValues.hallDetails[0]?.hallMinHours
                              );
                              const maxHours = parseInt(value);
                              return (
                                !minHours ||
                                maxHours >= minHours ||
                                "Maximum hours must be greater than or equal to minimum hours"
                              );
                            },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallMaxHours &&
                          errors.hallDetails[0].hallMaxHours.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors["hallDetails.0.hallMinHours"]}
                    >
                      <FormLabel>Minimum Rental Hours</FormLabel>
                      <NumberInput min={1}>
                        <NumberInputField
                          placeholder="Enter minimum rental hours"
                          {...register("hallDetails.0.hallMinHours", {
                            required: "Minimum rental hours required",
                            min: { value: 1, message: "At least 1 hour" },
                            validate: (value, formValues) => {
                              const maxHours = parseInt(
                                formValues.hallDetails[0]?.hallMaxHours
                              );
                              const minHours = parseInt(value);
                              return (
                                !maxHours ||
                                minHours <= maxHours ||
                                "Minimum hours must be less than or equal to maximum hours"
                              );
                            },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallMinHours &&
                          errors.hallDetails[0].hallMinHours.message}
                      </FormErrorMessage>
                    </FormControl>
                    {/* Hall Time Range: two time inputs */}
                    <FormControl
                      isInvalid={errors["hallDetails.0.hallStartTime"]}
                    >
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        {...register("hallDetails.0.hallStartTime", {
                          required: "Start time is required",
                        })}
                      />
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallStartTime &&
                          errors.hallDetails[0].hallStartTime.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors["hallDetails.0.hallEndTime"]}
                    >
                      <FormLabel>End Time</FormLabel>
                      <Input
                        type="time"
                        {...register("hallDetails.0.hallEndTime", {
                          required: "End time is required",
                        })}
                      />
                      <FormErrorMessage>
                        {errors?.hallDetails?.[0]?.hallEndTime &&
                          errors.hallDetails[0].hallEndTime.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Catering Details Section (only for catering service) */}
            {serviceType === "catering" && (
              <Card bg={cardBg} borderRadius="md">
                <CardHeader>
                  <Heading size="md">Catering Details</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl isInvalid={errors.cateringMaxHours}>
                      <FormLabel>Maximum Hours</FormLabel>
                      <NumberInput min={1}>
                        <NumberInputField
                          placeholder="Enter maximum hours"
                          {...register("cateringMaxHours", {
                            required: "Maximum hours is required",
                            min: { value: 1, message: "At least 1 hour" },
                            validate: (value, formValues) => {
                              return (
                                !formValues.cateringMinHours ||
                                parseInt(value) >=
                                parseInt(formValues.cateringMinHours) ||
                                "Maximum hours cannot be less than minimum hours"
                              );
                            },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.cateringMaxHours &&
                          errors.cateringMaxHours.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.cateringMinHours}>
                      <FormLabel>Minimum Hours</FormLabel>
                      <NumberInput min={1}>
                        <NumberInputField
                          placeholder="Enter minimum hours"
                          {...register("cateringMinHours", {
                            required: "Minimum hours is required",
                            min: { value: 1, message: "At least 1 hour" },
                            validate: (value, formValues) => {
                              return (
                                !formValues.cateringMaxHours ||
                                parseInt(value) <=
                                parseInt(formValues.cateringMaxHours) ||
                                "Minimum hours cannot be greater than maximum hours"
                              );
                            },
                          })}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.cateringMinHours &&
                          errors.cateringMinHours.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Service Availability Section for Decoration & Catering */}
            {(serviceType === "decoration" || serviceType === "catering") && (
              <Card bg={cardBg} borderRadius="md">
                <CardHeader>
                  <Heading size="md">Service Time Range</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl isInvalid={errors.serviceTimeStart}>
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        type="time"
                        {...register("serviceTimeStart", {
                          required: "Start time is required",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.serviceTimeStart &&
                          errors.serviceTimeStart.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.serviceTimeEnd}>
                      <FormLabel>End Time</FormLabel>
                      <Input
                        type="time"
                        {...register("serviceTimeEnd", {
                          required: "End time is required",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.serviceTimeEnd && errors.serviceTimeEnd.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Dynamic Packages Section for Decoration & Catering */}
            <AnimatePresence>
              {serviceType === "decoration" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card bg={cardBg} borderRadius="md" mt={4}>
                    <CardHeader>
                      <Heading size="md">Decoration Packages</Heading>
                    </CardHeader>
                    <CardBody>
                      {decorationPackageFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            mb={4}
                            borderBottom="1px solid"
                            borderColor={borderColor}
                            pb={4}
                          >
                            <FormControl
                              isInvalid={
                                errors.decorationPackages?.[index]?.packageName
                              }
                            >
                              <FormLabel>Package Name</FormLabel>
                              <Input
                                placeholder="Package Name"
                                {...register(
                                  `decorationPackages.${index}.packageName`,
                                  { required: "Required" }
                                )}
                              />
                              <FormErrorMessage>
                                {errors.decorationPackages?.[index]
                                  ?.packageName &&
                                  errors.decorationPackages[index].packageName
                                    .message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl
                              isInvalid={
                                errors.decorationPackages?.[index]?.packagePrice
                              }
                              mt={2}
                            >
                              <FormLabel>Package Price</FormLabel>
                              <Input
                                type="number"
                                placeholder="Package Price"
                                {...register(
                                  `decorationPackages.${index}.packagePrice`,
                                  {
                                    required: "Required",
                                    min: {
                                      value: 0,
                                      message: "Price must be positive",
                                    },
                                  }
                                )}
                              />
                              <FormErrorMessage>
                                {errors.decorationPackages?.[index]
                                  ?.packagePrice &&
                                  errors.decorationPackages[index].packagePrice
                                    .message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={2}>
                              <FormLabel>Package Description</FormLabel>
                              <Textarea
                                placeholder="Package Description"
                                {...register(
                                  `decorationPackages.${index}.packageDescription`
                                )}
                              />
                            </FormControl>

                            <Button
                              mt={2}
                              size="sm"
                              colorScheme="red"
                              leftIcon={<FiTrash2 />}
                              onClick={() => removeDecorationPackage(index)}
                            >
                              Remove Package
                            </Button>
                          </Box>
                        </motion.div>
                      ))}
                      <Button
                        mt={2}
                        colorScheme="green"
                        leftIcon={<FiPlusCircle />}
                        onClick={() =>
                          appendDecorationPackage({
                            packageName: "",
                            packagePrice: 0,
                            packageDescription: "",
                          })
                        }
                      >
                        Add Package
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              )}

              {serviceType === "catering" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card bg={cardBg} borderRadius="md" mt={4}>
                    <CardHeader>
                      <Heading size="md">Catering Packages</Heading>
                    </CardHeader>
                    <CardBody>
                      {cateringPackageFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Box
                            mb={4}
                            borderBottom="1px solid"
                            borderColor={borderColor}
                            pb={4}
                          >
                            <FormControl
                              isInvalid={
                                errors.cateringPackages?.[index]?.packageName
                              }
                            >
                              <FormLabel>Package Name</FormLabel>
                              <Input
                                placeholder="Package Name"
                                {...register(
                                  `cateringPackages.${index}.packageName`,
                                  { required: "Required" }
                                )}
                              />
                              <FormErrorMessage>
                                {errors.cateringPackages?.[index]
                                  ?.packageName &&
                                  errors.cateringPackages[index].packageName
                                    .message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl
                              isInvalid={
                                errors.cateringPackages?.[index]?.pricePerPerson
                              }
                              mt={2}
                            >
                              <FormLabel>Price Per Plate</FormLabel>
                              <Input
                                type="number"
                                placeholder="Price per plate"
                                {...register(
                                  `cateringPackages.${index}.pricePerPerson`,
                                  {
                                    required: "Required",
                                    min: {
                                      value: 0,
                                      message: "Price must be positive",
                                    },
                                  }
                                )}
                              />
                              <FormErrorMessage>
                                {errors.cateringPackages?.[index]
                                  ?.pricePerPerson &&
                                  errors.cateringPackages[index].pricePerPerson
                                    .message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl mt={2}>
                              <FormLabel>Package Description</FormLabel>
                              <Textarea
                                placeholder="Package Description"
                                {...register(
                                  `cateringPackages.${index}.packageDescription`
                                )}
                              />
                            </FormControl>

                            <Button
                              mt={2}
                              size="sm"
                              colorScheme="red"
                              leftIcon={<FiTrash2 />}
                              onClick={() => removeCateringPackage(index)}
                            >
                              Remove Package
                            </Button>
                          </Box>
                        </motion.div>
                      ))}
                      <Button
                        mt={2}
                        colorScheme="green"
                        leftIcon={<FiPlusCircle />}
                        onClick={() =>
                          appendCateringPackage({
                            packageName: "",
                            pricePerPerson: 0,
                            packageDescription: "",
                          })
                        }
                      >
                        Add Package
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Upload Section */}
            <Card bg={cardBg} borderRadius="md">
              <CardHeader>
                <Heading size="md">Upload Images</Heading>
              </CardHeader>
              <CardBody>
                <FormControl>
                  <FormLabel htmlFor="images">
                    <HStack>
                      <Icon as={FiImage} />
                      <Text>Upload Images</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
              </CardBody>
            </Card>

            {/* Submit Button with Spinner */}
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="full"
              leftIcon={<FiPackage />}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Service
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}
