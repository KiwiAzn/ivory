import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import { FunctionComponent } from "react";

export interface LightModeToggleProps
  extends Omit<IconButtonProps, "aria-label" | "onClick" | "icon"> {}

const LightModeToggle: FunctionComponent<LightModeToggleProps> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-hidden
      aria-label="toggle-light-mode"
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      {...props}
    />
  );
};

export default LightModeToggle;
