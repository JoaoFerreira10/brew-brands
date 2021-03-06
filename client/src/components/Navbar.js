import React from "react";
import { Box, Text, Heading, Image, Button } from "gestalt";
import { NavLink } from "react-router-dom";
import { getToken, clearToken } from "../utils";

const Navbar = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={70}
    color="midnight"
    padding={1}
  >
    {/* Sign In Link */}
    <NavLink activeClassName="active" to="/signin">
      <Text size="xl" color="white">
        Sign In
      </Text>
    </NavLink>

    {/* Title and Logo */}
    <NavLink activeClassName="active" exact to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
          <Image
            alt="BrewHaha Logo"
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
          />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>
      </Box>
    </NavLink>

    {/* Sign Up Link */}
    <NavLink activeClassName="active" to="/signup">
      {getToken() === null ?
            <Text size="xl" color="white">
            Sign Up
          </Text>: 
          <Button text= "Sign out" color="transparent" size="md" onClick={() => clearToken()}></Button>}

    </NavLink>
  </Box>
);

export default Navbar;
