import {
  Badge,
  Box,
  Input,
  VStack,
  Text,
  Flex,
  Spacer,
  StackDivider,  
} from "@chakra-ui/react";
import { DiceRoll } from "rpg-dice-roller";
import React, { ChangeEventHandler, KeyboardEventHandler, useState } from "react";

const DiceRoller = () => {
  const [previousDiceRolls, setPreviousDiceRolls] =
    useState<Array<DiceRoll>>([]);
  const [currentNotation, setCurrentNotation] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCurrentNotation(event.target.value)
    if(isInvalid) {
      try {
        new DiceRoll(event.target.value);
        setIsInvalid(false);
      } catch (error) {
        if(error.name === 'SyntaxError') {
          setIsInvalid(true);
        } else {
          throw error;
        }
      }
    }
  }

  const handleKeyDown:KeyboardEventHandler<HTMLInputElement> = ({key}) => {
    if(key === 'Enter') {
      try {
        const newDiceRoll = new DiceRoll(currentNotation);
        setPreviousDiceRolls([newDiceRoll, ...previousDiceRolls]);
      } catch (error) {
        if(error.name === 'SyntaxError') {
          setIsInvalid(true);
        } else {
          throw error;
        }
      }
    }
  };

  return (
    <VStack spacing="4" align="stretch">
      <Input
        placeholder="3d6+10"
        value={currentNotation}
        role='textbox'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        isInvalid={isInvalid}
      />
      <VStack divider={<StackDivider />} spacing={4} align="stretch" role='list'>
        {previousDiceRolls.map(({ notation, rolls, total }, index) => (
          <Flex key={index} role='listitem'>
            <Box p="4">
              <Badge>{notation}</Badge>
            </Box>            
            <Spacer/>
            <Box p="4" color='grey'>
              <Text>{rolls.join(' ')}</Text>
            </Box>
            <Box p="4">
              <Text>{total}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </VStack>
  );
};
export default DiceRoller;
