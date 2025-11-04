// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "chat"], // persist both
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store (no manual thunk)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);
