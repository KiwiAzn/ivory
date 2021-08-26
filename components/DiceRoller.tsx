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
import React, { FunctionComponent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";

const HelperTextError: React.FunctionComponent<HelpTextProps> = (props) => (
  <FormHelperText color='red.500' {...props}/>  
);

type FormValues = {
  diceNotation: string;
};

const validateDiceNotation = (value: string) => {
  if (value === '') {
    return true;
  }
  try {
    new DiceRoll(value);
    return true;
  } catch (error) {
    switch (error.name) {
      case 'SyntaxError':
        return false;
      default:
        throw error;
    }
  }
};

const DiceRoller: FunctionComponent = () => {
  const [previousDiceRolls, setPreviousDiceRolls] =
    useState<Array<DiceRoll>>([]);

  const { register, handleSubmit, formState: {errors}} = useForm<FormValues>({reValidateMode:'onSubmit'});

  const onSubmit: SubmitHandler<FormValues> = ({diceNotation}) => {
    const newDiceRoll = new DiceRoll(diceNotation)
    setPreviousDiceRolls([newDiceRoll, ...previousDiceRolls]);
  };

  return (
    <VStack spacing="4" align="stretch">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <FormControl id='diceNotation' isInvalid={Boolean(errors?.diceNotation)}> 
          <InputGroup>
            <Input          
              placeholder="3d6+10"              
              role='textbox'
              {...register('diceNotation', {
                required: true,
                validate: {
                  validDiceNotation: validateDiceNotation
                }
              })}
            />
            {errors.diceNotation &&  <InputRightElement>
              <WarningTwoIcon color='red.500'/>
            </InputRightElement> }
          </InputGroup>
          {errors.diceNotation && <HelperTextError>
            <FormattedMessage
              id='diceNotation.invalidInput'
              defaultMessage='Please enter a valid dice notation'
            />
          </HelperTextError>}
        </FormControl>
      </form>
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
