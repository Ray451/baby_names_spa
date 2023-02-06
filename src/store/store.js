import { configureStore } from "@reduxjs/toolkit";
import babyListReducer from "./babyListSlice";

export default configureStore({
  reducer: {
    babyList: babyListReducer,
  },
});