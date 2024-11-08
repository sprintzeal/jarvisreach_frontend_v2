import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { apiSlice } from "../slices/apiSlice";
import folderReducer from "../slices/folderSlice";
import userDataReducer from "../slices/userDataSlice";
import authReducer from "../slices/authSlice";

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    folder: folderReducer,
    userData: userDataReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
