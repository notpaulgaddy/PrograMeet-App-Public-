import { createSlice } from "@reduxjs/toolkit";

const querySlice = createSlice({
  name: "searchTerm",
  initialState: {
    q: "",
  },

  reducers: {
    setSearchTerm(state, action) {
      state.q = action.payload;
    },
  },
});

export const { setSearchTerm } = querySlice.actions;
export default querySlice.reducer;
