import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";
import { useAtom } from "jotai";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import nameAtom from "../atoms/nameAtom";
import { HelperTextError } from "../DiceRoller";

export interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: React.RefObject<FocusableElement>;
}

interface SetNameFormValues {
  name: string;
}

const NameModal: FunctionComponent<NameModalProps> = ({
  isOpen,
  onClose,
  finalFocusRef,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SetNameFormValues>();

  const [name, setName] = useAtom(nameAtom);

  useEffect(() => {
    if (name) {
      setValue("name", name);
    }
  }, [name, setValue]);

  const onSubmit: SubmitHandler<SetNameFormValues> = ({ name }) => {
    setName(name);
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
          <FormattedMessage id="nameModal.title" defaultMessage="Set name" />
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <VStack spacing="4">
              <FormControl id="name" isInvalid={Boolean(errors?.name)}>
                <FormLabel>
                  <FormattedMessage
                    id="nameModal.form.name"
                    defaultMessage="Name"
                  ></FormattedMessage>
                </FormLabel>
                <InputGroup>
                  <Input
                    placeholder="John Doe"
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
                      id="name.invalidInput"
                      defaultMessage="Please enter your name"
                    />
                  </HelperTextError>
                )}
              </FormControl>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button mr="3" onClick={onClose}>
            <FormattedMessage id="nameModal.cancel" defaultMessage="Close" />
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            <FormattedMessage id="nameModal.submit" defaultMessage="Save" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NameModal;
