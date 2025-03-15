import React from "react";
import "../eves/publicevent.css";
import { useNavigate } from "react-router-dom";
// import poster from "../../assets/profile.png";




const PublicEveCard = ({ id:eventid, title:eventname,poster}) => {
    // const details = useSelector(EventList);
    const navigate = useNavigate();

    const showInfo = () => {
        navigate(`/event/eventinfo/${eventname}/${eventid}`);
    };
    
    const register = () => {
        navigate(`/event/register/${eventname}/${eventid}`);
    }

    return (
        <div className="event-container">
        <div className="event-card">
            <span>{eventid}.</span>
            <img src={poster} alt="Event Poster" className="event-image"/>
            <div className="event-content">
                <h3>{eventname}</h3>
                <div className="event-details">
                    <h5>for more information click view details</h5>
                </div>
                <div className="event-buttons">
                    <button onClick={showInfo} className="view-details">View Details</button>
                    <button onClick={register} className="register">Register</button>
                </div>
            </div>
        </div>
        </div>
        );
};

export default PublicEveCard;
