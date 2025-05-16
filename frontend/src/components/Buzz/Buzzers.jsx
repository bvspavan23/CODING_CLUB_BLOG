import React from "react";
import { useDispatch } from "react-redux";
import { removeRoom } from "../../redux/slice/buzzSlice";
import { deleteBuzzRoom } from "../../services/Buzzers/buzzServices";
import { useNavigate } from "react-router-dom";
import "../eves/event.css";

const Buzzers = ({ name, roomId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Buzz room?")) {
      try {
        await deleteBuzzRoom(roomId);
        dispatch(removeRoom(roomId)); // use roomId to filter
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room.");
      }
    }
  };

  const handleManage = () => {
    navigate(`/manage/${roomId}`);
  };

  return (
    <div className="event-container">
      <div className="event-card">
        <span>***.</span>
        <div className="event-content">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-gray-600">Room ID: <span className="font-mono text-blue-600">{roomId}</span></p>

          <div className="event-buttons">
            <button onClick={handleManage} className="view-details">
              Manage Room
            </button>
            <button onClick={handleDelete} className="remove">
              Delete Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buzzers;
