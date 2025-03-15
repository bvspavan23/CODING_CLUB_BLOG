import React, { useState, useEffect } from "react";
import PublicEveCard from "./PublicEveCard";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

const PublicEve = () => {
    const clubEves = useSelector(state => state.event.clubEves);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clubEves.length > 0) {
            setLoading(false);
        }
    }, [clubEves]);

    return (
        <div className="public-container min-h-screen flex justify-center items-center">
            {loading ? (
                <div className="flex flex-col items-center">
                    <ClipLoader size={50} color={"#36D7B7"} loading={loading} />
                    <h2 className="text-lg font-semibold text-gray-700 mt-3">Events are loading, please wait...</h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {clubEves.map(obj => (
                        <PublicEveCard
                            key={obj.eventid}
                            id={obj.eventid}
                            title={obj.eventname}
                            poster={obj.image.url}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicEve;
