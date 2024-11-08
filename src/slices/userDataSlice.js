import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    userInfoData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { userInfoData } = userDataSlice.actions;

export default userDataSlice.reducer;
