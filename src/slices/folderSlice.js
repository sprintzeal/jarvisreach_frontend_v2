import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
};

const folderSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFolder: (state, action) => {
      state.folders = action.payload;
    },
  },
});

export const { setFolder } = folderSlice.actions;

export default folderSlice.reducer;
