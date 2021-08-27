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
import React, { FunctionComponent, useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { diceRollsAtom, selectedDiceNotationAtom } from "./atoms";
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

const DiceRoller: FunctionComponent = () => {
  const [previousDiceRolls, setPreviousDiceRolls] = useAtom(diceRollsAtom);
  const [selectedDiceNotation] = useAtom(selectedDiceNotationAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({ reValidateMode: "onSubmit" });

  useEffect(() => {
    setValue("diceNotation", selectedDiceNotation);
  }, [selectedDiceNotation, setValue]);

  const onSubmit: SubmitHandler<FormValues> = ({ diceNotation }) => {
    const newDiceRoll = new DiceRoll(diceNotation);
    setPreviousDiceRolls([newDiceRoll, ...previousDiceRolls]);
  };

  const submitButtonRef = useRef(null);

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
          <ButtonGroup isAttached>
            <Button type="submit" ref={submitButtonRef}>
              <FormattedMessage
                id="diceNotation.callToAction"
                defaultMessage="Roll"
              />
            </Button>
            <DynamicAddDiceNotationToFavourites
              diceNotation={watch("diceNotation")}
              finalFocusRef={submitButtonRef}
            />
          </ButtonGroup>
        </HStack>
      </form>
      <DynamicFavouriteDiceRolls />
      <DynamicPreviousDiceRolls />
    </VStack>
  );
};

export default DiceRoller;
