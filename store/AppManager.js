import { createSlice } from "@reduxjs/toolkit";

const appManagerSlice = createSlice({
  name: "AppState",
  initialState: {
    appState: null,
  },
  reducers: {
    setAppState(state, action) {
      state.appState = action.payload;
    },
  },
});

export const { setAppState } = appManagerSlice.actions;
export default appManagerSlice.reducer;
