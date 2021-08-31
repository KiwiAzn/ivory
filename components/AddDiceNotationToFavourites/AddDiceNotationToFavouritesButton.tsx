import { IconButton, useDisclosure } from "@chakra-ui/react";
import React, { FunctionComponent, RefObject } from "react";
import { StarIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
import { FocusableElement } from "@chakra-ui/utils";

export interface AddDiceNotationToFavouritesProps {
  diceNotation: string;
  finalFocusRef?: RefObject<FocusableElement>;
}

const DynamicAddDiceNotationToFavouritesModal = dynamic(
  import("./AddDiceNotationToFavouritesModal"),
  { ssr: false }
);

const AddDiceNotationToFavouritesButton: FunctionComponent<AddDiceNotationToFavouritesProps> =
  ({ diceNotation, finalFocusRef }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <IconButton
          aria-label="Add dice roll to favourites"
          onClick={onOpen}
          icon={<StarIcon />}
        />
        <DynamicAddDiceNotationToFavouritesModal
          isOpen={isOpen}
          onClose={onClose}
          diceNotation={diceNotation}
          finalFocusRef={finalFocusRef}
        />
      </>
    );
  };

export default AddDiceNotationToFavouritesButton;
