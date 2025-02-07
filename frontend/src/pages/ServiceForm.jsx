import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useSelector } from 'react-redux'



export default function ServiceForm() {
  const [images, setImages] = useState([])
  const toast = useToast()
  const {userId} = useSelector((state) => state.auth)
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    // Fetch user data when the component mounts
    axios.get(`http://localhost:5678/auth/${userId}`)
      .then(response => {
        const userData = response.data
        // Populate form fields with user data
        Object.keys(userData).forEach(key => {
          setValue(key, userData[key])
        })
      })
      .catch(error => {
        toast({
          title: "Error loading user data.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      })
  }, [userId, setValue, toast])

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
        uploadedUrls.push(response.data.user.image.slice(-1)[0]); // Get the last uploaded URL
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

    try {
        const response = await axios.get(`http://localhost:5678/auth/${userId}`);
    const existingImages = response.data.image || [];
      const uploadedUrls = await uploadImagesToCloudinary(); // Upload images first
      const allImages = [...existingImages, ...uploadedUrls];
      const formData = { ...data, image: allImages }; // Add uploaded image URLs
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
    }
}

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  return (
    <Box maxWidth="500px" margin="auto" padding={6}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Create Service
        </Heading>
        <Text textAlign="center" color="gray.600">
          Please fill in the details of your service below.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                readOnly
                isDisabled
                
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                readOnly
                isDisabled
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.mobileNumber}>
              <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
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
                      message: "Invalid mobile number"
                    }
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.mobileNumber && errors.mobileNumber.message}
              </FormErrorMessage>
            </FormControl>

            

            <FormControl isInvalid={errors.location}>
              <FormLabel htmlFor="location">Location</FormLabel>
              <Input
                id="location"
                placeholder="Enter service location"
                {...register("location", { required: "Location is required" })}
              />
              <FormErrorMessage>
                {errors.location && errors.location.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.serviceName}>
              <FormLabel htmlFor="serviceName">Service Name</FormLabel>
              <Input
                id="serviceName"
                placeholder="Enter service name"
                {...register("serviceName", { required: "Service name is required" })}
              />
              <FormErrorMessage>
                {errors.serviceName && errors.serviceName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.price}>
              <FormLabel htmlFor="price">Price</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  id="price"
                  placeholder="Enter price"
                  {...register("price", { 
                    required: "Price is required", 
                    min: {
                      value: 0,
                      message: "Price must be positive"
                    }
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

            <FormControl>
              <FormLabel htmlFor="images">Upload Images</FormLabel>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" width="full">
              Submit
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  )
}
