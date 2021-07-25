import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../theme";

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<ColorModeProvider
				options={{
					useSystemColorMode: false,
				}}
			>
				<Component {...pageProps} />
			</ColorModeProvider>
		</ChakraProvider>
	);
}

export default MyApp;
