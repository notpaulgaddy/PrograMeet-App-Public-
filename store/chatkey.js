import { createSlice } from "@reduxjs/toolkit";

const chatKeySlice = createSlice({
  name: "activeChatKey",
  initialState: {
    chatKey: null,
  },

  reducers: {
    setActiveChatKey(state, action) {
      state.chatKey = action.payload;
    },
  },
});

export const { setActiveChatKey } = chatKeySlice.actions;
export default chatKeySlice.reducer;
