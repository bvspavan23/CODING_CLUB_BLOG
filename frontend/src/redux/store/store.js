import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import eventReducer from "../slice/eventSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
  },
});
export default store;