import {
  Input,
  VStack,
  FormControl,
  InputRightElement,
  InputGroup,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormLabel,
} from "@chakra-ui/react";
import React, { FunctionComponent, RefObject, useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import savedDiceRollsAtom, { SavedDiceRoll } from "../atoms/savedDiceRollsAtom";
import { HelperTextError, validateDiceNotation } from "../DiceRoller";
import { useAtom } from "jotai";
import { FocusableElement } from "@chakra-ui/utils";

export interface AddDiceNotationToFavouritesProps {
  diceNotation: string;
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: React.RefObject<FocusableElement>;
}

interface AddDiceNotationsToFavouritesFormValues extends SavedDiceRoll {}

const AddDiceNotationToFavouritesModal: FunctionComponent<AddDiceNotationToFavouritesProps> =
  ({ diceNotation, isOpen, onClose, finalFocusRef }) => {
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
      reset,
    } = useForm<AddDiceNotationsToFavouritesFormValues>({
      reValidateMode: "onSubmit",
    });
    const [savedDiceRolls, setSavedDiceRolls] = useAtom(savedDiceRollsAtom);

    useEffect(() => {
      setValue("diceNotation", diceNotation);
    }, [diceNotation, setValue]);

    const onSubmit: SubmitHandler<AddDiceNotationsToFavouritesFormValues> = ({
      diceNotation,
      name,
    }) => {
      setSavedDiceRolls([...savedDiceRolls, { diceNotation, name }]);
      reset();
      onClose();
    };

    const initialRef = useRef(null);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalFocusRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage
              id="saveDiceNotationModal.title"
              defaultMessage="Add dice roll to favourites"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form autoComplete="off">
              <VStack spacing="4">
                <FormControl id="name" isInvalid={Boolean(errors?.name)}>
                  <FormLabel>
                    <FormattedMessage
                      id="saveDiceNotationModal.form.name"
                      defaultMessage="Name"
                    ></FormattedMessage>
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Initiative"
                      role="textbox"
                      {...register("name", {
                        required: true,
                      })}
                      ref={initialRef}
                    />
                    {errors.name && (
                      <InputRightElement>
                        <WarningTwoIcon color="red.500" />
                      </InputRightElement>
                    )}
                  </InputGroup>
                  {errors.name && (
                    <HelperTextError>
                      <FormattedMessage
                        id="diceNotation.invalidInput"
                        defaultMessage="Please enter a valid dice notation"
                      />
                    </HelperTextError>
                  )}
                </FormControl>
                <FormControl
                  id="diceNotation"
                  isInvalid={Boolean(errors?.diceNotation)}
                >
                  <FormLabel>
                    <FormattedMessage
                      id="saveDiceNotationModal.form.diceNotation"
                      defaultMessage="Dice notation"
                    ></FormattedMessage>
                  </FormLabel>
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
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mr="3" onClick={onClose}>
              <FormattedMessage
                id="savedDiceNotationModal.cancel"
                defaultMessage="Close"
              />
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              <FormattedMessage
                id="saveDiceNotationModal.submit"
                defaultMessage="Add"
              />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

export default AddDiceNotationToFavouritesModal;
