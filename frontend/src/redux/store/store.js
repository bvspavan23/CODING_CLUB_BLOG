import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import eventReducer from "../slice/eventSlice";
import regReducer from "../slice/everegSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    eveRegs: regReducer
  },
});
export default store;