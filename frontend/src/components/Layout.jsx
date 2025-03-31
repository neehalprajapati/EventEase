import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./Footer"; // Make sure to import Footer with correct path

const Layout = ({ children }) => {
  return (
    <Flex
      direction="column"
      minH="100vh"
    >
      <Box
        pt="100px"
        flex="1"
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;