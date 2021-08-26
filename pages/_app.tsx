import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { IntlProvider } from "react-intl";

const theme = extendTheme({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <IntlProvider locale='en'>
        <Component {...pageProps} />
      </IntlProvider>
    </ChakraProvider>
  );
}

export default MyApp;
