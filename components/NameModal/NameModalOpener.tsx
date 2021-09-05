import { useDisclosure } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FunctionComponent, useEffect } from "react";
import nameAtom from "../atoms/nameAtom";
import NameModal from "./NameModal";

const NameModalOpener: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name] = useAtom(nameAtom);

  useEffect(() => {
    if (!name) {
      onOpen();
    }
  }, [name, onOpen]);

  return <NameModal isOpen={isOpen} onClose={onClose} />;
};

export default NameModalOpener;
