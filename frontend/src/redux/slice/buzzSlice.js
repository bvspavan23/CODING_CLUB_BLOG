import { createSlice } from "@reduxjs/toolkit";

const buzzSlice = createSlice({
  name: "buzzer",
  initialState: {
    name: "",
    roomId: "",
    rooms: [],
  },
  reducers: {
    storeAction: (state, action) => {
      const { name, roomId } = action.payload;
      state.name = name;
      state.roomId = roomId;
      state.rooms.push({
        name,
        roomId,
      });
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    removeRoom: (state, action) => {
      state.rooms = state.rooms.filter((room) => room._id !== action.payload);
    },
  },
});

export const { storeAction, setRooms, removeRoom } = buzzSlice.actions;
export default buzzSlice.reducer;
