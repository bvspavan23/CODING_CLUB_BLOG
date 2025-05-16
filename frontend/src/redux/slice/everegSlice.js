import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const regSlice = createSlice({
    name: "eveRegs",
    initialState: {
        eveRegs: [],
    },
    reducers: {
        setregAction: (state, action) => {
            state.eveRegs = action.payload;
        },
        registerAction: (state, action) => {
            state.eveRegs.push({
                eventid:action.payload.eventid,
                studentname:action.payload.studentname,
                studentemail:action.payload.studentemail,
                jntuno:action.payload.jntuno,
                studentmobile:action.payload.studentmobile,
                studentyear:action.payload.studentyear,
                branch:action.payload.branch,
            })
        }
    },           
});

export const registrationsApi = () => async (dispatch) => {
    try {
        const response = await axios.get("https://cc-blog-backend.onrender.com/api/v1/students");
        dispatch(setregAction(response.data));
    } catch (error) {
        console.log(error);
    }
}

export const {registerAction,setregAction} = regSlice.actions;
export const regList = (state) => state.eveRegs.eveRegs;
const regReducer=regSlice.reducer
export default regReducer;
