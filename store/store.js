import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./user";
import modalReducer from "./model";
import searchReducer from "./search";
import chatReducer from "./chatview";
import chatkeyReducer from "./chatkey";
import queryReducer from "./searchq";
import appStateReducer from "./AppManager";

export const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    search: searchReducer,
    activeChat: chatReducer,
    chatkey: chatkeyReducer,
    q: queryReducer,
    appState: appStateReducer,
  },
});
