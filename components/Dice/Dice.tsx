import { Box, BoxProps, Flex, GridItem, keyframes } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const rotateKeyframes = keyframes`
  0% { transform: rotate3d(1, 1.5, -1, 0deg); }
  100% { transform: rotate3d(1, 1.5, -1, 360deg); }
`;

const Dice = () => (
  <Box
    sx={{
      animation: `${rotateKeyframes} 10s linear infinite`,
      width: "144px",
      height: "144px",
      transform: "rotate3d(1, 1, 0, 60deg)",
      transformStyle: "preserve-3d",
    }}
  >
    <Side sx={{ transform: "rotateX(0deg) translateZ(15vmin)" }}>
      <Flex
        sx={{ width: "100%", height: "100%" }}
        align="center"
        justify="center"
      >
        <Dot />
      </Flex>
    </Side>
    <Side sx={{ transform: "rotateY(270deg) translateZ(15vmin)" }}>
      <Flex sx={{ width: "100%", height: "100%" }} justify="space-between">
        <Dot />
        <Dot sx={{ alignSelf: "flex-end" }} />
      </Flex>
    </Side>
    <Side sx={{ transform: "rotateX(270deg) translateZ(15vmin)" }}>
      <Flex sx={{ width: "100%", height: "100%" }} justify="space-between">
        <Dot />
        <Dot sx={{ alignSelf: "center" }} />
        <Dot sx={{ alignSelf: "flex-end" }} />
      </Flex>
    </Side>
    <Side sx={{ transform: "rotateX(90deg) translateZ(15vmin)" }}>
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
    <Side sx={{ transform: "rotateY(90deg) translateZ(15vmin)" }}>
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
    <Side sx={{ transform: "rotateX(180deg) translateZ(15vmin)" }}>
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

const Side: FunctionComponent<BoxProps> = ({ sx, ...props }) => (
  <Box
    {...props}
    sx={{
      background: "var(--chakra-colors-chakra-body-text)",
      position: "absolute",
      width: "100%",
      height: "100%",
      padding: 4,
      ...sx,
    }}
  />
);

const Dot: FunctionComponent<BoxProps> = ({ sx, ...props }) => (
  <Box
    {...props}
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "var(--chakra-colors-chakra-body-bg)",
      ...sx,
    }}
  />
);

export default Dice;
