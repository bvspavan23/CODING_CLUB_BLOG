import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    joinInfo: localStorage.getItem('joinInfo') 
        ? JSON.parse(localStorage.getItem('joinInfo'))
        : null
};

const joinSlice = createSlice({
    name: 'join',
    initialState,
    reducers: {
        join: (state, action) => {
            state.joinInfo = action.payload;
            localStorage.setItem('joinInfo', JSON.stringify(action.payload));
        },
        exit: (state) => {
            state.joinInfo = null;
            localStorage.removeItem('joinInfo');
        }
    }
});

export const { join, exit } = joinSlice.actions;
export default joinSlice.reducer; 