import { createStore, applyMiddleware, compose } from "redux";
import { AsyncStorage } from "react-native";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";

import rootReducer from "../reducers";

export default function configureStore(initState) {
  const middleware = [];

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  if (__DEV__) {
    middleware.push(createLogger());
  }

  const persistConfig = {
    key: "YOUWALLET-ROOT",
    storage: AsyncStorage,
    blacklist: ["ui", "navigation"]
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    initState,
    compose(applyMiddleware(...middleware))
  );

  const persistedStore = persistStore(store);
  return { store, persistedStore };
}
