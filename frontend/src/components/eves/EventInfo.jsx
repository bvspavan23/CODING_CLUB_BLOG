import React, { useEffect, useState } from "react";
import "../eves/EventInfo.css";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getEventByIdAPI } from "../../services/events/eventService";

// Convert 24-hour time to 12-hour format
const convertTo12Hour = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

// Format date
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const EventInfo = () => {
  const { eventid, eventname } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const stripHtmlTags = (html = "") => html.replace(/<[^>]+>/g, "");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventByIdAPI(eventid);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventid]);

  const register = () => {
    navigate(`/event/register/${eventname}/${eventid}`);
  };

  if (loading) {
    return (
      <center>
        <ClipLoader color="#3498db" size={50} />
        <h2>Loading event details...</h2>
      </center>
    );
  }

  if (!event) {
    return <h2>Event not found</h2>;
  }

  return (
    <center>
      <div className="details-container">
        <h2>
          <b>{event.eventname}</b>
        </h2>

        <div className="poster">
          <img src={event.image?.url} alt="poster" />
        </div>

        <div className="description">
          {stripHtmlTags(event.description)}
        </div>

        <div className="timings">
          <h4><b>Event Schedule</b></h4>
          {event.schedules.map((s, index) => (
            <h5 key={index}>
              <b>
                {formatDate(s.date)} (
                {convertTo12Hour(s.startTime)} –{" "}
                {convertTo12Hour(s.endTime)})
              </b>
            </h5>
          ))}

          <h5>
            <b>Venue: {event.venue}</b>
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
