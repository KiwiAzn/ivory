import { Box, Center, Heading, Hide, keyframes, Text } from "@chakra-ui/react";
import Dice from "components/Dice/Dice";
import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";

const glitchKeyframes = keyframes`
0% {
  text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
  transform: translate(var(--glitch-translate));
}
2% {
  text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
}
4%, 100% {  text-shadow: none; transform: none; }
`;

const stackKeyFrames = keyframes`
0% {
  opacity: 0;
  transform: translateX(-50%);
  text-shadow: -2px 3px 0 red, 2px -3px 0 blue;
};
60% {
  opacity: 0.5;
  transform: translateX(50%);
}
80% {
  transform: none;
  opacity: 1;
  text-shadow: 2px -3px 0 red, -2px 3px 0 blue;
}
100% {
  text-shadow: none;
}
`;

const Hero: React.FunctionComponent = () => (
  <Center>
    <Dice />
    <Box ml="2" p={["4", "8"]}>
      <Heading as="h1" size="4xl" fontFamily="Permanent Marker">
        Ivory
      </Heading>
      <Text fontSize="xl">
        <FormattedMessage
          id="hero.subTitle"
          defaultMessage="RPG dice roller built for the web"
          description="Subtitle text to accompany the app name"
        />
      </Text>
    </Box>
  </Center>
);

export default Hero;
