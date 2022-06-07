import { ChakraProvider } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";
import theme from "../styles/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <IntlProvider locale="en">
      <Story />
    </IntlProvider>
  ),
  (Story) => (
    <ChakraProvider theme={theme}>
      <Story />
    </ChakraProvider>
  ),
];
