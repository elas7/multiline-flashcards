import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollMemory from "react-router-scroll-memory";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import { store, persistor } from "./store";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router basename="/multiline-flashcards">
        <React.Fragment>
          <ScrollMemory elementID="scrollingElement" />
          <App />
        </React.Fragment>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
