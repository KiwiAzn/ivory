import {
  Box,
  BoxProps,
  Flex,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

const rotateKeyframes = keyframes`
  0% { transform: rotate3d(1, 1.5, -1, 0deg); }
  100% { transform: rotate3d(1, 1.5, -1, 360deg); }
`;

const Dice = () => (
  <Box
    sx={{
      "--dice-size": "64px",
      animation: `${rotateKeyframes} 20s linear infinite`,
      width: "var(--dice-size)",
      height: "var(--dice-size)",
      transform: "rotate3d(1, 1, 0, 60deg)",
      transformStyle: "preserve-3d",
      flex: "none",
    }}
  >
    <Side
      sx={{ transform: "rotateX(0deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex
        sx={{ width: "100%", height: "100%" }}
        align="center"
        justify="center"
      >
        <Dot />
      </Flex>
    </Side>
    <Side
      sx={{ transform: "rotateY(270deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex sx={{ width: "100%", height: "100%" }} justify="space-between">
        <Dot />
        <Dot sx={{ alignSelf: "flex-end" }} />
      </Flex>
    </Side>
    <Side
      sx={{ transform: "rotateX(270deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex sx={{ width: "100%", height: "100%" }} justify="space-between">
        <Dot />
        <Dot sx={{ alignSelf: "center" }} />
        <Dot sx={{ alignSelf: "flex-end" }} />
      </Flex>
    </Side>
    <Side
      sx={{ transform: "rotateX(90deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex
        direction="column"
        justify="space-between"
        sx={{ width: "100%", height: "100%" }}
      >
        <Flex justify="space-between">
          <Dot />
          <Dot />
        </Flex>
        <Flex justify="space-between">
          <Dot />
          <Dot />
        </Flex>
      </Flex>
    </Side>
    <Side
      sx={{ transform: "rotateY(90deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex justify="space-between">
        <Dot />
        <Dot />
      </Flex>
      <Flex justify="center">
        <Dot />
      </Flex>
      <Flex justify="space-between">
        <Dot />
        <Dot />
      </Flex>
    </Side>
    <Side
      sx={{ transform: "rotateX(180deg) translateZ(calc(var(--dice-size)/2))" }}
    >
      <Flex
        direction="column"
        justify="space-between"
        sx={{ width: "100%", height: "100%" }}
      >
        <Flex justify="space-between">
          <Dot />
          <Dot />
        </Flex>
        <Flex justify="space-between">
          <Dot />
          <Dot />
        </Flex>
        <Flex justify="space-between">
          <Dot />
          <Dot />
        </Flex>
      </Flex>
    </Side>
  </Box>
);

const Side: FunctionComponent<BoxProps> = ({ sx, ...props }) => {
  const backgroundColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue(
    "--chakra-colors-white",
    "--chakra-colors-gray-800"
  );
  return (
    <Box
      {...props}
      p={2}
      sx={{
        background: backgroundColor,
        border: `1px solid var(${borderColor})`,
        opacity: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        ...sx,
      }}
    />
  );
};

const Dot: FunctionComponent<BoxProps> = ({ sx, ...props }) => {
  const backgroundColor = useColorModeValue("white", "gray.800");
  return (
    <Box
      {...props}
      sx={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        ...sx,
      }}
    />
  );
};

export default Dice;
