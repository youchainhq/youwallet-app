import React from "react";
import { Provider } from "react-redux";

import configureStore from "./src/store";
import Root from "./src/root";
import EStyleSheet from "react-native-extended-stylesheet";
import { PersistGate } from "redux-persist/integration/react";

const { store, persistedStore } = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <Root />
      </PersistGate>
    </Provider>
  );
}

EStyleSheet.build();
