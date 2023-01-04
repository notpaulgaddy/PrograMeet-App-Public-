import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchData: {
      type: "",
      results: "",
      q: "",
    },
  },

  reducers: {
    setSearch(state, action) {
      state.searchData = action.payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;
export default searchSlice.reducer;
