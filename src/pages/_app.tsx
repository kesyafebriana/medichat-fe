import wrapper from "@/redux/store";
import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { swiffyslider } from "swiffy-slider";
import "swiffy-slider/css";
import React from "react";

function App({ Component, pageProps }: AppProps) {
	const { store } = wrapper.useWrappedStore({});
	// @ts-ignore
	const persistor = store.__persistor;

	React.useEffect(() => {
		// @ts-ignore
		window.swiffyslider = swiffyslider;

		window.addEventListener("load", () => {
			// @ts-ignore
			window.swiffyslider.init();
		});
	}, []);

	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
				</ChakraProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
