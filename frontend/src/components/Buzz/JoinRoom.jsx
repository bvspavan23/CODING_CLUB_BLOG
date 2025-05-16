import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { storeAction } from '../../redux/slice/buzzSlice';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("roomId From JoinRoom",roomId);
  console.log("name From JoinRoom",name);
  

  const handleJoin = () => {
    if (!name || !roomId) {
      alert("Please enter both name and room ID");
      return;
    }

    dispatch(storeAction({ name, roomId }));
    navigate(`/buzzer/${roomId}`);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />

        <button
          onClick={handleJoin}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition w-64"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
