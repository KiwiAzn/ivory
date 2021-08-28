import {
  Box,
  VStack,
  Text,
  Flex,
  Spacer,
  StackDivider,
  Button,
} from "@chakra-ui/react";
import React, { FunctionComponent } from "react";
import { useAtom } from "jotai";
import { diceRollsAtom } from "./atoms";

interface PreviousDiceRollsProps {
  onSelectDiceNotation: (diceNotation: string) => void;
}

const PreviousDiceRolls: FunctionComponent<PreviousDiceRollsProps> = ({
  onSelectDiceNotation,
}) => {
  const [previousDiceRolls] = useAtom(diceRollsAtom);

  return (
    <VStack divider={<StackDivider />} spacing={4} align="stretch" role="list">
      {previousDiceRolls.map(({ notation, rolls, total }, index) => (
        <Flex key={index} role="listitem">
          <Box p="4">
            <Button size="xs" onClick={() => onSelectDiceNotation(notation)}>
              {notation}
            </Button>
          </Box>
          <Spacer />
          <Box p="4" color="grey">
            <Text>{rolls.join(" ")}</Text>
          </Box>
          <Box p="4">
            <Text>{total}</Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  );
};

export default PreviousDiceRolls;
