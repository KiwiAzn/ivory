import {
  Input,
  VStack,
  FormControl,
  FormHelperText,
  HelpTextProps,
  InputRightElement,
  InputGroup,
  Button,
  HStack,
} from "@chakra-ui/react";
import { DiceRoll } from "rpg-dice-roller";
import React, { FunctionComponent, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom } from "jotai";
import {
  diceNotationHistoryAtom,
  diceRollsAtom,
  selectedDiceNotationAtom,
} from "./atoms";
import dynamic from 'next/dynamic';

const HelperTextError: React.FunctionComponent<HelpTextProps> = (props) => (
  <FormHelperText color="red.500" {...props} />
);

type FormValues = {
  diceNotation: string;
};

const validateDiceNotation = (value: string) => {
  if (value === "") {
    return true;
  }
  try {
    new DiceRoll(value);
    return true;
  } catch (error) {
    switch (error.name) {
      case "SyntaxError":
        return false;
      default:
        throw error;
    }
  }
};

const DynamicPreviousDiceRolls = dynamic(() => import('./PreviousDiceRolls'));

const DiceRoller: FunctionComponent = () => {
  const [, setDiceNotationHistory] = useAtom(diceNotationHistoryAtom);
  const [previousDiceRolls, setPreviousDiceRolls] = useAtom(diceRollsAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ reValidateMode: "onSubmit" });
  const [selectedDiceNotation] = useAtom(selectedDiceNotationAtom);

  useEffect(() => {
    setValue("diceNotation", selectedDiceNotation);
  }, [selectedDiceNotation, setValue]);

  const onSubmit: SubmitHandler<FormValues> = ({ diceNotation }) => {
    const newDiceRoll = new DiceRoll(diceNotation);
    setPreviousDiceRolls([newDiceRoll, ...previousDiceRolls]);
    setDiceNotationHistory((previousNotationHistory) => {
      const newCount = (previousNotationHistory[diceNotation] || 0) + 1;
      return { ...previousNotationHistory, [diceNotation]: newCount };
    });
  };

  return (
    <VStack spacing="4" align="stretch">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <HStack spacing="2" align="stretch">
          <FormControl
            id="diceNotation"
            isInvalid={Boolean(errors?.diceNotation)}
          >
            <InputGroup>
              <Input
                placeholder="3d6+1"
                role="textbox"
                {...register("diceNotation", {
                  required: true,
                  validate: {
                    validDiceNotation: validateDiceNotation,
                  },
                })}
              />
              {errors.diceNotation && (
                <InputRightElement>
                  <WarningTwoIcon color="red.500" />
                </InputRightElement>
              )}
            </InputGroup>
            {errors.diceNotation && (
              <HelperTextError>
                <FormattedMessage
                  id="diceNotation.invalidInput"
                  defaultMessage="Please enter a valid dice notation"
                />
              </HelperTextError>
            )}
          </FormControl>
          <Button type="submit">
            <FormattedMessage
              id="diceNotation.callToAction"
              defaultMessage="Roll"
            />
          </Button>
        </HStack>
      </form>
      <DynamicPreviousDiceRolls />
    </VStack>
  );
};

export default DiceRoller;
