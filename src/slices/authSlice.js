import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.auth = action.payload;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.auth = null;
      localStorage.removeItem("auth");
    },
    updateAvatar: (state, action) => {
      if (state.auth) {
        state.auth.avatar = action.payload;
        localStorage.setItem("auth", JSON.stringify(state.auth));
      }
    },
  },
});

export const { setCredentials, logout, updateAvatar } = authSlice.actions;

export default authSlice.reducer;
