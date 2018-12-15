import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollMemory from "react-router-scroll-memory";
import { LastLocationProvider } from "react-router-last-location";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import { store, persistor } from "./store";
import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router basename="/multiline-flashcards">
        <React.Fragment>
          <ScrollMemory elementID="scrollingElement" />
          <LastLocationProvider>
            <App />
          </LastLocationProvider>
        </React.Fragment>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
