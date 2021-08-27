import {
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FunctionComponent, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { selectedDiceNotationAtom } from "./atoms";
import savedDiceRollsAtom from "./atoms/savedDiceRollsAtom";

interface SavedDiceRollToDelete {
  name: string;
  index: number;
}

const FavouriteDiceRolls: FunctionComponent = () => {
  const [savedDiceRolls, setSavedDiceRolls] = useAtom(savedDiceRollsAtom);
  const [, setSelectedDiceNotation] = useAtom(selectedDiceNotationAtom);

  const [savedDiceRollToDelete, setSavedDiceRollToDelete] =
    useState<SavedDiceRollToDelete>({ index: -1, name: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  return (
    <>
      <Wrap spacing="4">
        {savedDiceRolls.map(({ name, diceNotation }, index) => (
          <Tag key={index}>
            <TagLabel onClick={() => setSelectedDiceNotation(diceNotation)}>
              {name}
            </TagLabel>
            <TagCloseButton
              onClick={() => {
                setSavedDiceRollToDelete({ name, index });
                onOpen();
              }}
            />
          </Tag>
        ))}
      </Wrap>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <FormattedMessage
                id="alert.deleteSavedDiceRoll.title"
                defaultMessage="Delete saved dice notation"
              />
            </AlertDialogHeader>
            <AlertDialogBody>
              <Stack spacing="3">
                <Text>
                  <FormattedMessage
                    id="alert.deleteSavedDiceRoll.message.1"
                    defaultMessage='Are you sure you wish to delete the saved dice notation "{diceNotationName}"?'
                    values={{ diceNotationName: savedDiceRollToDelete?.name }}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id="alert.deleteSavedDiceRoll.message.2"
                    defaultMessage="You cannot undo this action afterwards."
                  />
                </Text>
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                <FormattedMessage
                  id="alert.deleteSavedDiceRoll.cancel"
                  defaultMessage="Cancel"
                />
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  setSavedDiceRolls(
                    savedDiceRolls.filter(
                      (_savedDiceRoll, savedDiceRollIndex) =>
                        savedDiceRollIndex !== savedDiceRollToDelete.index
                    )
                  );
                  onClose();
                }}
                ml={3}
              >
                <FormattedMessage
                  id="alert.deleteSavedDiceRoll.confirm"
                  defaultMessage="Delete"
                />
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default FavouriteDiceRolls;
