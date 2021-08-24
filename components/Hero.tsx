import { Box, Center, Heading, Text } from "@chakra-ui/react";

const Hero: React.FunctionComponent = () => (
  <Center>
    <Box p="8">
      <Heading as="h1" size="4xl" fontFamily="Permanent Marker">
        Ivory
      </Heading>
      <Text fontSize="xl">RPG dice roller built for the web</Text>
    </Box>
  </Center>
);

export default Hero;