import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "activeChatUser",
  initialState: {
    uid: null,
  },

  reducers: {
    setActiveChatUser(state, action) {
      state.uid = action.payload;
    },
  },
});

export const { setActiveChatUser } = chatSlice.actions;
export default chatSlice.reducer;
