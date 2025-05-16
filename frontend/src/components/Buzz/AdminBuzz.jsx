import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getBuzzRooms } from '../../services/Buzzers/buzzServices';
import './Buzz.css';
import DialogBox from './DialoagBox';
const AdminBuzz = () => {
  const { roomId } = useParams();
  const name = "Admin";
  const [isValidRoom, setIsValidRoom] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [buzzOrder, setBuzzOrder] = useState([]);
  const [buzzEnabled, setBuzzEnabled] = useState(false);
  const socketRef = useRef(null);
  const ENDPOINT = "https://cc-blog-backend.onrender.com";
  useEffect(()=>{
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const rooms = await getBuzzRooms();
        const match = rooms.find((room) => room.roomId === roomId);
        setIsValidRoom(!!match);
        if (match && name && isMounted) {
          const newSocket = io(ENDPOINT, {
            transports: ["websocket"],
            withCredentials: true,
          });
          newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            newSocket.emit('join-room', { name, roomId, isAdmin: true });
          });
          newSocket.on("room-users", (users) => {
            if(isMounted) {
              setUsersInRoom(users);
              console.log('Users in room:', users);
            }
          });
          newSocket.on("buzz-order", (order) => {
            if(isMounted) {
              setBuzzOrder(order);
              console.log('Buzz order updated:', order);
            }
          });
          newSocket.on("buzz-status", ({ enabled }) => {
            if(isMounted) {
              setBuzzEnabled(enabled);
              console.log('Buzz status updated:', enabled);
            }
          });
          socketRef.current = newSocket;
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setIsValidRoom(false);
      }
    };
    fetchRooms();
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, name]);

const handleEnableBuzz = () => {
  if (socketRef.current) {
    socketRef.current.emit('enable-buzz', { roomId });
    // Reset buzz order when enabling
    socketRef.current.emit('reset-buzz', { roomId });
  }
};
  const handleDisableBuzz = () => {
    if (socketRef.current) {
      socketRef.current.emit('disable-buzz', { roomId });
    }
  };
  const handleResetBuzz = () => {
    if (socketRef.current) {
      socketRef.current.emit('reset-buzz', { roomId });
    }
  };
  if (isValidRoom === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!isValidRoom) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-2xl">Invalid Room ID</div>;
  }
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 p-4 md:p-6 gap-4">
      <div className="w-full md:w-1/4 md:pr-4 flex flex-col order-1 md:order-1">
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-4 shadow-md animate-fade-in">
          <h1 className="text-xl font-bold">Room: {roomId}</h1>
          <p className="text-blue-100">Admin: {name}</p>
        </div>
        <DialogBox 
          title="Participants" 
          items={usersInRoom} 
        />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center order-3 md:order-2">
        <div className="flex flex-col items-center space-y-6 w-full max-w-md">
          <div className="flex space-x-4">
            <button
              onClick={handleEnableBuzz}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${buzzEnabled ?'bg-green-500 hover:bg-green-600':'bg-green-500 hover:bg-green-600'}`}
            >
              Enable Buzz
            </button>
            <button
              onClick={handleDisableBuzz}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-colors ${
                !buzzEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Disable Buzz
            </button>
          </div>          
          <button
            onClick={handleResetBuzz}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
          >
            Reset Buzz Order
          </button>
          <div className="w-full bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-lg font-semibold">Buzz Status:</p>
            <p className={`text-2xl font-bold ${
              buzzEnabled?'text-green-600':'text-red-600'}`}>
              {buzzEnabled?'ACTIVE':'INACTIVE'}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/4 md:pl-4 order-2 md:order-3">
        <DialogBox 
          title="Buzz Order" 
          items={buzzOrder} 
          highlightFirstThree={true}
        />
      </div>
    </div>
  );
};

export default AdminBuzz;