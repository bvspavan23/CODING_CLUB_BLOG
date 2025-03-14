import React from "react";
import { useSelector } from "react-redux";
import Eve from "./Eve";

const EveList = () => {
  const eveList = useSelector((state) => state.event.clubEves);
  console.log(eveList);

  return (
    <div>
      {eveList && eveList.length > 0 ? (
        eveList.map((item) => (
          <Eve
            key={item.eventid}
            id={item.eventid}
            title={item.eventname}
            poster={item.image.url}
          />
        ))
      ) : (
        <p>No events available!</p>
      )}
    </div>
  );
};

export default EveList;
