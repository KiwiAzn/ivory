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
  ButtonGroup,
} from "@chakra-ui/react";
import { DiceRoll } from "rpg-dice-roller";
import React, { FunctionComponent, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";

import dynamic from "next/dynamic";

export const HelperTextError: React.FunctionComponent<HelpTextProps> = (
  props
) => <FormHelperText color="red.500" {...props} />;

type FormValues = {
  diceNotation: string;
};

export const validateDiceNotation = (value: string) => {
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

const DynamicPreviousDiceRolls = dynamic(() => import("./PreviousDiceRolls"));

const DynamicAddDiceNotationToFavourites = dynamic(
  () =>
    import("./AddDiceNotationToFavourites/AddDiceNotationToFavouritesButton")
);

const DynamicFavouriteDiceRolls = dynamic(
  () => import("./FavouriteDiceRolls"),
  { ssr: false }
);

const DynamicDiceRoomHandler = dynamic(
  () => import("./DiceRoom/DiceRoomHandler"),
  { ssr: false }
);

const DiceRoller: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus,
    watch,
  } = useForm<FormValues>({ reValidateMode: "onSubmit" });

  const { ref, ...diceNotationRegisterProps } = register("diceNotation", {
    required: true,
    validate: {
      validDiceNotation: validateDiceNotation,
    },
  });

  const diceNotationRef = useRef<HTMLInputElement | null>(null);

  const handleSelectDiceNotation = (diceNotation: string): void => {
    setValue("diceNotation", diceNotation);
    setFocus("diceNotation");
  };

  const rollDice = useRef<Function | null>(null);

  const onSubmit: SubmitHandler<FormValues> = ({ diceNotation }) => {
    rollDice.current!(diceNotation);
  };

  return (
    <VStack spacing="4" align="stretch">
      <DynamicDiceRoomHandler rollDiceRef={rollDice} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <HStack spacing="2" align="stretch">
          <FormControl
            id="diceNotation"
            isInvalid={Boolean(errors?.diceNotation)}
          >
            <InputGroup>
              <Input
                id="diceNotation"
                placeholder="3d6+1"
                role="textbox"
                {...diceNotationRegisterProps}
                ref={(e) => {
                  ref(e);
                  diceNotationRef.current = e;
                }}
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
          <ButtonGroup isAttached>
            <Button type="submit">
              <FormattedMessage
                id="diceNotation.callToAction"
                defaultMessage="Roll"
              />
            </Button>
            <DynamicAddDiceNotationToFavourites
              diceNotation={watch("diceNotation")}
              finalFocusRef={diceNotationRef}
            />
          </ButtonGroup>
        </HStack>
      </form>
      <DynamicFavouriteDiceRolls
        onSelectDiceNotation={handleSelectDiceNotation}
      />
      <DynamicPreviousDiceRolls
        onSelectDiceNotation={handleSelectDiceNotation}
      />
    </VStack>
  );
};

export default DiceRoller;
