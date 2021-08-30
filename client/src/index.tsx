import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Store";
import dotenv from "dotenv";

dotenv.config();

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistor = persistStore(store as any);

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>,
	document.getElementById("root"),
);
