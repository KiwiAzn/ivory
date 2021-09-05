import {
  Box,
  VStack,
  Text,
  Flex,
  Spacer,
  StackDivider,
  Button,
} from "@chakra-ui/react";
import React, { Fragment, FunctionComponent } from "react";
import { useAtom } from "jotai";
import { diceRollsAtom } from "./atoms";
import { FormattedMessage } from "react-intl";

interface PreviousDiceRollsProps {
  onSelectDiceNotation: (diceNotation: string) => void;
}

const PreviousDiceRolls: FunctionComponent<PreviousDiceRollsProps> = ({
  onSelectDiceNotation,
}) => {
  const [previousDiceRolls] = useAtom(diceRollsAtom);

  return (
    <VStack divider={<StackDivider />} spacing={4} align="stretch" role="list">
      {previousDiceRolls.map(
        ({ rollerName, notation, resultBreakdown, result }, index) => (
          <Fragment key={index}>
            {rollerName && (
              <Text pl="4">
                <FormattedMessage
                  id="rolledDice"
                  defaultMessage="{name} rolled:"
                  values={{ name: rollerName }}
                />
              </Text>
            )}
            <Flex role="listitem">
              <Box p="4">
                <Button
                  size="xs"
                  onClick={() => onSelectDiceNotation(notation)}
                >
                  {notation}
                </Button>
              </Box>
              <Spacer />
              <Box p="4" color="grey">
                <Text>{resultBreakdown}</Text>
              </Box>
              <Box p="4">
                <Text>{result}</Text>
              </Box>
            </Flex>
          </Fragment>
        )
      )}
    </VStack>
  );
};

export default PreviousDiceRolls;
