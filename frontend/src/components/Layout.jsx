import React from "react";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box pt="100px"> 
      {children}
    </Box>
  );
};

export default Layout;
