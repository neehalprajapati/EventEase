import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  IconButton,
  useToast,
  Container,
  Grid,
  Skeleton,
  useColorModeValue,
  Badge,
  Flex,
  Spinner
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  FaTrash,
  FaUpload,
  FaImage,
  FaMapMarkerAlt,
  FaDollarSign,
  FaInfo,
} from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { Global, css } from "@emotion/react";


export default function ServiceView() {
  const { userId } = useSelector((state) => state.auth);
  const [images, setImages] = useState("");
  const [service, setService] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await axios.get(`http://localhost:5678/auth/${userId}`);
        const serviceData = res.data;
        setService(serviceData);
        setImages(serviceData.image || []);
        setThumbnail(serviceData.thumbnail || "");
        //console.log(images);

        if (!serviceData.thumbnail && serviceData.image?.length > 0) {
          const firstImage = serviceData.image[0];
          setThumbnail(firstImage);
          await axios.put(
            `http://localhost:5678/auth/set-thumbnail/${userId}`,
            {
              thumbnailUrl: firstImage,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
        toast({
          title: "Error",
          description: "Failed to load service details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceData();
  }, [userId, toast, reload]);

  const handleSetThumbnail = async (image) => {
    try {
      const response = await axios.put(
        `http://localhost:5678/auth/set-thumbnail/${userId}`,
        {
          thumbnailUrl: image,
        }
      );
      setThumbnail(response.data.thumbnail);
      toast({
        title: "Thumbnail Updated",
        description: "This image is now set as the thumbnail.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to update the thumbnail.";
      console.error("Error updating thumbnail:", message);
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files || []);
    const uploadedUrls = [];
    for (const file of files) {
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
        uploadedUrls.push(response.data.url);
        toast({
          title: "Image uploaded",
          description: "Image uploaded sucessfully and saved",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error uploading images",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setReload((prev) => !prev)
    }
    setImages((prevImages) => [...prevImages, ...uploadedUrls]);
  };

  const handleDeleteImage = async (image) => {
    //console.log(image);
    try {
      await axios.post(`http://localhost:5678/auth/delete-image/${userId}`, {
        imageUrl: image,
      });

      setImages((prevImages) => prevImages.filter((img) => img !== image));
      if (thumbnail === image) {
        setThumbnail(images.filter((img) => img !== image)[0] || "");
      }
      toast({
        title: "Image Deleted",
        description: "The image has been removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting image",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="stretch">
          <Skeleton height="200px" />
          <Skeleton height="300px" />
          <Skeleton height="100px" />
        </VStack>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>No service details available.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      
      <Global
        styles={css`
          .swiper-slide-active .group:hover .group-hover {
            opacity: 1;
          }
        `}
      />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", }} gap={8}>
        <Box>
          <Heading size="lg" mb={4}>
            {service.username}'s Service
          </Heading>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="md"
          >
            <Image
              src={thumbnail || "/placeholder.svg"}
              alt="Thumbnail"
              objectFit="cover"
              w="100%"
              h="300px"
            />
            <Box p={6}>
              <VStack align="start" spacing={4}>
                <Flex align="center">
                  <FaImage color="blue.500" />
                  <Text ml={2} fontWeight="bold">
                    Type:
                  </Text>
                  <Badge ml={2} colorScheme="blue">
                    {service.serviceType}
                  </Badge>
                </Flex>
                <Flex align="center">
                  <FaDollarSign color="green.500" />
                  <Text ml={2} fontWeight="bold">
                    Price:
                  </Text>
                  <Text ml={2}>${service.price}</Text>
                </Flex>
                <Flex align="center">
                  <FaMapMarkerAlt color="red.500" />
                  <Text ml={2} fontWeight="bold">
                    Location:
                  </Text>
                  <Text ml={2}>{service.location}</Text>
                </Flex>
                <Flex align="start">
                  <FaInfo color="purple.500" style={{ marginTop: "5px" }} />
                  <VStack align="start" ml={2} spacing={1}>
                    <Text fontWeight="bold">Description:</Text>
                    <Text>{service.description}</Text>
                  </VStack>
                </Flex>
              </VStack>
            </Box>
          </Box>
        </Box>
        <Box>
          <Heading size="md" mb={4}>
            Service Images
          </Heading>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="md"
          >
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              spaceBetween={10}
              slidesPerView={1}
              style={{ width: "600px", height: "400px" }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Box position="relative" w="full" h="full" className="group">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Slide ${index + 1}`}
                      objectFit="cover"
                      w="full"
                      h="full"
                    />
                    <Box
                      position="absolute"
                      bottom={4}
                      left={0}
                      right={0}
                      display="flex"
                      justifyContent="center"
                      opacity={0}
                      transition="opacity 0.3s"
                      _groupHover={{ opacity: 1 }}
                    >
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleSetThumbnail(image)}
                          leftIcon={<FaImage />}
                        >
                          Set as Thumbnail
                        </Button>
                        <IconButton
                          size="sm"
                          colorScheme="red"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteImage(image)}
                          aria-label="Delete Image"
                        />
                      </HStack>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          <HStack mt={6} spacing={4} justifyContent="center">
            <input
              type="file"
              accept="image/*"
              multiple
              id="upload-images"
              onChange={handleUploadImages}
              style={{ display: "none" }}
            />
            <label htmlFor="upload-images">
              <Button as="span" leftIcon={<FaUpload />} colorScheme="green">
                Upload Images
              </Button>
            </label>
            <Button colorScheme="red" leftIcon={<FaTrash />}>
              Delete Service
            </Button>
          </HStack>
        </Box>
      </Grid>
    </Container>
  );
}
