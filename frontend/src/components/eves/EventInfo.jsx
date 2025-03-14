import React, { useEffect } from "react";
import "../eves/EventInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { EventList, eventlistApi } from "../../redux/slice/eventSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; 

// Function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time) => {
  if (!time) return ""; // Handle undefined/null cases
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 to 12 for AM
  return `${hour}:${minutes} ${ampm}`;
};

// Function to format date from "YYYY-MM-DDTHH:mm:ss.sssZ" to "DD-MM-YYYY"
const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Handle undefined/null cases
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const EventInfo = () => {
  const dispatch = useDispatch();
  const { eventid, eventname } = useParams();
  const navigate = useNavigate();
  const Details = useSelector(EventList);
  const stripHtmlTags = (html) => html.replace(/<[^>]+>/g, "");

  const register = () => {
    navigate(`/event/register/${eventname}/${eventid}`);
  };

  useEffect(() => {
    if (Details.length === 0) {
      dispatch(eventlistApi());
    }
  }, [dispatch, Details.length]);

  const Info = Details.find((event) => event.eventid === String(eventid));
  console.log("THESE ARE THE DETAILS:", Info);

  if (!Info) {
    return (
      <center>
        <ClipLoader color="#3498db" size={50} />
        <h2>Loading event details...</h2>
      </center>
    );
  }

  return (
    <center>
      <div className="details-container">
        <h2>
          <b>{Info.eventname}</b>
        </h2>
        <center>
          <div className="poster">
            <img src={Info.image.url} alt="poster" />
          </div>
        </center>
        <div className="description">{stripHtmlTags(Info.description)}</div>
        <div className="timings">
          <h5>
            <b>
              Start-Date: {formatDate(Info.startdate)} (Start-Time:{" "}
              {convertTo12Hour(Info.starttime)})
            </b>
          </h5>
          <h5>
            <b>Venue: {Info.venue}</b>
          </h5>
          <h5>
            <b>
              End-Date: {formatDate(Info.enddate)} (End-Time:{" "}
              {convertTo12Hour(Info.endtime)})
            </b>
          </h5>
        </div>
        <div className="regi">
          <button onClick={register}>Register</button>
        </div>
      </div>
    </center>
  );
};

export default EventInfo;
