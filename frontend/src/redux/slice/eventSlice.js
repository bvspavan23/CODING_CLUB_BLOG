import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { updateEventAPI } from "../../services/events/eventService";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    // clubEves: [
    //     { eventid: '1', eventname: "QUICK-BUZZ",startdate:"11-11-2024",enddate:"12-11-2024",description:"abcd",venue:"Seminar Hall",eligibility:"1st Years"},
    //     { eventid: '2', eventname: "PATTERN-PRINTING",startdate:"23-11-2024",enddate:"24-11-2024",description:"",venue:"DA Lab",eligibility:"2nd Years" },
    //     { eventid: '3', eventname: "CODE-WARRIORS",startdate:"",enddate:"",description:"",venue:"",eligibility:"" },
    //     { eventid: '4', eventname: "HACK-A-THON",startdate:"",enddate:"",description:"",venue:"",eligibility:"" },
    // ],
    clubEves: [],
  },

  reducers: {
    seteveAction: (state, action) => {
      state.clubEves = action.payload;
    },
    addeveAction: (state, action) => {
      state.clubEves.push({
        eventid: action.payload.eventid,
        eventname: action.payload.eventname,
        startdate: action.payload.startdate,
        starttime: action.payload.starttime,
        enddate: action.payload.enddate,
        endtime: action.payload.endtime,
        description: action.payload.description,
        venue: action.payload.venue,
        eligibility: action.payload.eligibility,
        image: action.payload.image,
      });
    },
    removeeveAction: (state, action) => {
      const delEvent = action.payload;
      state.clubEves = state.clubEves.filter(
        (event) => event.eventid !== delEvent
      );

      axios
        .delete(`https://cc-blog-backend.onrender.com/api/v1/events/${delEvent}`)
        // .delete(`https://cc-blog-backend.onrender.com/api/v1/events/${delEvent}`)
        .then((response) => {
          console.log("Event removed from db", response.data);
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          state.clubEves.push(
            state.clubEves.find((event) => event.eventid === delEvent)
          );
        });
    },
    updateeveAction: (state, action) => {
      const {
        eventname,
        newEventName,
        eligibility,
        description,
        startdate,
        starttime,
        enddate,
        endtime,
        venue,
        image,
      } = action.payload;

      // Create FormData object
      const formData = new FormData();
      formData.append("eventname", eventname);
      formData.append("newEventName", newEventName);
      formData.append("eligibility", eligibility);
      formData.append("description", description);
      formData.append("startdate", startdate);
      formData.append("starttime", starttime);
      formData.append("enddate", enddate);
      formData.append("endtime", endtime);
      formData.append("venue", venue);
      if (image) {
        formData.append("image", image);
      }

      updateEventAPI(eventname, formData)
        .then((response) => {
          console.log("Event updated in DB", response);

          state.clubEves = state.clubEves.map((event) =>
            event.eventname === eventname
              ? { ...event, ...response.updatedEvent } 
              : event
          );
        })
        .catch((error) => {
          console.error("Error updating event:", error);
        });
    },
  },
  
});

export const eventlistApi = () => async (dispatch) => {
  try {
    const response = await axios.get("https://cc-blog-backend.onrender.com/api/v1/events");
    // const response = await axios.get("http://localhost:8000/api/v1/events");
    dispatch(seteveAction(response.data));
  } catch (error) {
    console.log(error);
  }
};

export const { seteveAction, addeveAction, removeeveAction, updateeveAction} =eventSlice.actions;
export const EventList = (state) => state.event.clubEves;
export default eventSlice.reducer;
