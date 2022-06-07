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
      <Heading
        as="h1"
        size="4xl"
        fontFamily="Permanent Marker"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          "--stacks": "3",
          "& span": {
            gridRowStart: 1,
            gridColumnStart: 1,
            "--stack-height": "calc(100% / var(--stacks))",
            "--inverse-index": "calc(calc(var(--stacks) - 1) - var(--index))",
            "--clip-top": "calc(var(--stack-height) * var(--index))",
            "--clip-bottom": "calc(var(--stack-height) * var(--inverse-index))",
            clipPath: "inset(var(--clip-top) 0 var(--clip-bottom) 0)",
            animation: `${stackKeyFrames} 340ms cubic-bezier(.46,.29,0,1.24) 1 backwards calc(var(--index) * 120ms), ${glitchKeyframes} 2s ease infinite 2s alternate-reverse`,
            userSelect: "none",
          },
          "& span:nth-child(even)": {
            "--glitch-translate": "8px",
          },
          "& span:nth-child(odd)": {
            "--glitch-translate": "-8px",
          },
        }}
      >
        <span style={{ "--index": 0 } as CSSProperties}>Ivory</span>
        <span style={{ "--index": 1 } as CSSProperties}>Ivory</span>
        <span style={{ "--index": 2 } as CSSProperties}>Ivory</span>
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
