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
  Skeleton,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FunctionComponent, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import savedDiceRollsAtom from "./atoms/savedDiceRollsAtom";

interface SavedDiceRollToDelete {
  name: string;
  index: number;
}

export interface FavouriteDiceRollsProps {
  onSelectDiceNotation: (diceNotation: string) => void;
}

const FavouriteDiceRolls: FunctionComponent<FavouriteDiceRollsProps> = ({
  onSelectDiceNotation,
}) => {
  const [savedDiceRolls, setSavedDiceRolls] = useAtom(savedDiceRollsAtom);

  const [savedDiceRollToDelete, setSavedDiceRollToDelete] =
    useState<SavedDiceRollToDelete>({ index: -1, name: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  if (savedDiceRolls.length === 0) {
    return (
      <Wrap spacing="4">
        <Skeleton>
          <Tag>
            <TagLabel>Initiative</TagLabel>
          </Tag>
        </Skeleton>
      </Wrap>
    );
  }

  return (
    <>
      <Wrap spacing="4">
        {savedDiceRolls.map(({ name, diceNotation }, index) => (
          <Tag
            key={index}
            cursor="pointer"
            onClick={() => onSelectDiceNotation(diceNotation)}
          >
            <TagLabel userSelect="none">{name}</TagLabel>
            <TagCloseButton
              onClick={(event) => {
                event.preventDefault();
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
