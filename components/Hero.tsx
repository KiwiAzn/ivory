import { Box, Center, Heading, Text } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

const Hero: React.FunctionComponent = () => (
  <Center>
    <Box p="8">
      <Heading as="h1" size="4xl" fontFamily="Permanent Marker">
        Ephemeral Demo
      </Heading>
      <Text fontSize="xl">
        <FormattedMessage
          id="hero.subTitle"
          defaultMessage="I hope my demo works"
          description="Subtitle text to accompany the app name"
        />
      </Text>
    </Box>
  </Center>
);

export default Hero;
