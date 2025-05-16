import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "../../redux/slice/buzzSlice";
import { getBuzzRooms } from "../../services/Buzzers/buzzServices";
import Buzzers from "./Buzzers";

const BuzzList = () => {
  const dispatch = useDispatch();
  const buzzList = useSelector((state) => state.buzzer.rooms);
  useEffect(() => {
    const fetchBuzzRooms = async () => {
      try {
        const data = await getBuzzRooms();
        dispatch(setRooms(data));
      } catch (err) {
        console.error("Failed to fetch Buzz rooms:", err);
      }
    };
    fetchBuzzRooms();
  }, [dispatch]);
  return (
    <div>
      {buzzList && buzzList.length > 0 ? (
        buzzList.map((room) => (
          <Buzzers
            key={room._id}
            name={room.name}
            roomId={room.roomId}
          />
        ))
      ) : (
        <p>No Buzz rooms available!</p>
      )}
    </div>
  );
};

export default BuzzList;
