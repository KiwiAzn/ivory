import {
  Badge,
  Box,
  Input,
  VStack,
  Text,
  Flex,
  Spacer,
  StackDivider,
  FormControl,
  FormHelperText,
  HelpTextProps,
  InputRightElement,
  InputGroup,  
} from "@chakra-ui/react";
import { DiceRoll } from "rpg-dice-roller";
import React, { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";

const HelperTextError: React.FunctionComponent<HelpTextProps> = (props) => (
  <FormHelperText color='red.500' {...props}/>  
);

const DiceRoller = () => {
  const [previousDiceRolls, setPreviousDiceRolls] =
    useState<Array<DiceRoll>>([]);
  const [currentNotation, setCurrentNotation] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const diceNotation = event.target.value;    
    setCurrentNotation(diceNotation);
    if(isInvalid && !!diceNotation) {
      try {
        new DiceRoll(diceNotation);
        setIsInvalid(false);
      } catch (error) {
        switch(error.name) {
          case 'SyntaxError':
            return setIsInvalid(true);
          default:
            throw error;            
        }        
      }
    }
  }

  const handleKeyDown:KeyboardEventHandler<HTMLInputElement> = ({key}) => {
    if(key === 'Enter' && !!currentNotation) {
      try {
        const newDiceRoll = new DiceRoll(currentNotation);
        setPreviousDiceRolls([newDiceRoll, ...previousDiceRolls]);
      } catch (error) {
        switch(error.name) {
          case 'SyntaxError':
            return setIsInvalid(true);
          default:
            throw error;            
        }
      }
    }
  };

  return (
    <VStack spacing="4" align="stretch">
      <FormControl id='diceNotation'>
        <InputGroup>
          <Input          
            placeholder="3d6+10"
            value={currentNotation}
            role='textbox'
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            isInvalid={isInvalid}
          />
          {isInvalid &&  <InputRightElement>
            <WarningTwoIcon color='red.500'/>
          </InputRightElement> }
        </InputGroup>
        {isInvalid && <HelperTextError>
          <FormattedMessage
            id='diceNotation.invalidInput'
            defaultMessage='Please enter a valid dice notation'
          />
        </HelperTextError>}
      </FormControl>
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
