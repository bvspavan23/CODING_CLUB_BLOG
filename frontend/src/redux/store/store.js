import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import eventReducer from "../slice/eventSlice";
import regReducer from "../slice/everegSlice";
import buzzReducer from "../slice/buzzSlice";
import quizReducer from "../slice/quizSlice";
import joinReducer from "../slice/JoinSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    eveRegs: regReducer,
    buzzer: buzzReducer,
    quiz: quizReducer,
    join: joinReducer
  },
});
export default store;