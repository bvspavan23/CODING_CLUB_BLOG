import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBuzzRoom } from '../../services/Buzzers/buzzServices';

const CreateBuzz = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      alert('Please enter the Buzz room name!');
      return;
    }
    try {
      const data = await createBuzzRoom(name);
      setRoomId(data.roomId);
      setRoomCreated(true);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };
  const handleManageRoom = () => {
    if (!roomId) return;
    navigate(`/manage/${roomId}`);
  };
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold text-gray-700">Create Buzz Room</h1>
        <input
          type="text"
          placeholder="Enter Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <button
          onClick={handleCreateRoom}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition w-64"
        >
          Create Room
        </button>
        {roomCreated && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Room ID:</p>
            <p className="text-lg font-mono font-bold text-blue-700">{roomId}</p>
          </div>
        )}
        <button
          onClick={handleManageRoom}
          disabled={!roomId}
          className={`mt-4 px-6 py-2 ${
            roomId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          } text-white font-semibold rounded-md transition w-64`}
        >
          Manage Room
        </button>
      </div>
    </div>
  );
};

export default CreateBuzz;
