import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import '@fontsource/permanent-marker';

const theme = extendTheme({
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
};

export default MyApp;