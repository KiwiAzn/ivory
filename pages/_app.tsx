import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";
import theme from "../styles/theme";
import "@fontsource/permanent-marker";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <IntlProvider locale="en">
        <Component {...pageProps} />
      </IntlProvider>
    </ChakraProvider>
  );
}

export default MyApp;
