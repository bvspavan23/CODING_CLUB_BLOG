import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
    name: "quiz",
    initialState: {
        quizzes: [],
    },

    reducers: {
        setquizAction: (state, action) => {
            state.quizzes = action.payload;  
        },
        createQuizAction: (state, action) => {
            state.quizzes.push({
                _id: action.payload._id,
                name: action.payload.name,
                startdate: action.payload.startdate,
                enddate: action.payload.enddate,
                starttime: action.payload.starttime,
                endtime: action.payload.endtime,
                quizcode: action.payload.quizcode,
                duration: action.payload.duration,
                maxpoints: action.payload.maxpoints
            });
        },
        deleteQuizAction: (state, action) => {
            state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);

        },
    },
});

export const { createQuizAction, deleteQuizAction, setquizAction} = quizSlice.actions;
const quizReducer = quizSlice.reducer;
export default quizReducer;
