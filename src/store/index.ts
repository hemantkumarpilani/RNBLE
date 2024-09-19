import { configureStore } from "@reduxjs/toolkit";

import { persistStore } from "redux-persist";
import persistedReducer from "./reducers";


const store = configureStore({
    reducer : persistedReducer,
})

const persistor = persistStore(store)

export {persistor, store}