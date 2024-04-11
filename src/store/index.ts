import { configureStore } from "@reduxjs/toolkit";
import businessSlice from "./business/businessSlice";

export default configureStore({
  reducer: {
    business: businessSlice,
  },
});
