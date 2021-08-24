import { Box, Center, Container, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <Container>
      <Hero></Hero>
    </Container>
  );
};

export default Home;

const Hero: React.FunctionComponent = () => (
  <Center>
    <Box>
      <Heading as="h1" size="4xl" fontFamily="Permanent Marker">
        Ivory
      </Heading>
      <Text fontSize="xl">RPG dice roller built for the web</Text>
    </Box>
  </Center>
);
