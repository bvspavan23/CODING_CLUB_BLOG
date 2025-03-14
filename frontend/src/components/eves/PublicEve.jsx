import React from "react";
import PublicEveCard from "./PublicEveCard";
import "../eves/publicevent.css";
import { useSelector } from "react-redux";


const PublicEve= () => {
    const clubEves= useSelector(state => state.event.clubEves);
    return (
        <div className="public-container">
                {clubEves.map(obj => (
                    <PublicEveCard
                        key={obj.eventid}
                        id={obj.eventid}
                        title={obj.eventname}
                        poster={obj.image.url}
                    />
                ))}
        </div>
    );
};
export default PublicEve;
