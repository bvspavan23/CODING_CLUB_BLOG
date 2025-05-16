import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getBuzzRooms } from '../../services/Buzzers/buzzServices';
import confetti from 'canvas-confetti';
import './Buzz.css';
import DialogBox from './DialoagBox';
const Buzz = () => {
  const { roomId } = useParams();
  const name = useSelector((state) => state.buzzer.name);
  const [buzzed, setBuzzed] = useState(false);
  const [isValidRoom, setIsValidRoom] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [buzzOrder, setBuzzOrder] = useState([]);
  const [buzzEnabled, setBuzzEnabled] = useState(false);
  const [isFirstBuzzer, setIsFirstBuzzer] = useState(false);
  const socketRef = useRef(null);
  const buttonRef = useRef(null);
  const confettiFiredRef = useRef(false);

  const ENDPOINT = "https://cc-blog-backend.onrender.com";

  const launchConfetti = () => {
    if (confettiFiredRef.current) return;  
    confettiFiredRef.current = true;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
    })
    setTimeout(()=>confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    }), 250);
    setTimeout(()=>confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    }), 400);
  };

  useEffect(()=>{
    if (buzzOrder.length > 0 && buzzOrder[0].name === name && !confettiFiredRef.current) {
      setIsFirstBuzzer(true);
      launchConfetti();
    } else if (buzzOrder.length === 0) {
      confettiFiredRef.current = false;
      setIsFirstBuzzer(false);
    }
  }, [buzzOrder, name]);

  useEffect(()=>{
    let isMounted = true;
    const fetchRooms = async()=>{
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
            newSocket.emit('join-room', { name, roomId });
          });
          newSocket.on("room-users", (users) => {
            if (isMounted) setUsersInRoom(users);
          });
          newSocket.on("buzz-order", (order) => {
            if (isMounted) {
              setBuzzOrder(order);
              console.log('Buzz order updated:', order);
            }
          });
          newSocket.on("buzz-status", ({ enabled }) => {
            if (isMounted) {
              setBuzzEnabled(enabled);
              console.log('Buzz status updated:', enabled);
              // Reset buzzed state when buzz is disabled
              if (!enabled) {
                setBuzzed(false);
                setIsFirstBuzzer(false);
                confettiFiredRef.current = false;
              }
            }
          });
          newSocket.on("user-joined", (data) => {
            console.log(`${data.name} joined the room`);
          });
          newSocket.on("user-left", (data) => {
            console.log(`${data.name} left the room`);
          });
          socketRef.current = newSocket;
        }
      }catch(err){
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

  const handleBuzz = () => {
    if (!buzzed && socketRef.current && buzzEnabled) {
      socketRef.current.emit('buzz', { roomId });
      setBuzzed(true);
      
      if (buttonRef.current) {
        buttonRef.current.classList.add('animate-press');
        setTimeout(() => {
          if (buttonRef.current) buttonRef.current.classList.remove('animate-press');
        }, 200);
      }
    }
  };
  if(isValidRoom === null){
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if(!isValidRoom){
    return <div className="flex items-center justify-center h-screen text-red-500 text-2xl">Invalid Room ID</div>;
  }
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-100 p-4 md:p-6 gap-4">
      <div className="w-full md:w-1/4 md:pr-4 flex flex-col order-1 md:order-1">
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-4 shadow-md animate-fade-in">
          <h1 className="text-xl font-bold">Room: {roomId}</h1>
          <p className="text-blue-100">Your name: {name}</p>
        </div>
        <DialogBox 
          title="Participants" 
          items={usersInRoom} 
        />
      </div>
      <div className="flex-grow flex flex-col items-center justify-center order-3 md:order-2">
        <button
          ref={buttonRef}
          onClick={handleBuzz}
          className={`text-5xl font-extrabold w-60 h-60 md:w-72 md:h-72 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out mb-8 ${
            !buzzEnabled?'bg-gray-400 text-white cursor-not-allowed':buzzed?`bg-red-600 text-white scale-105 shadow-[0_0_35px_rgba(220,38,38,0.7)] cursor-not-allowed ${isFirstBuzzer?'animate-bounce':'animate-pulse'}`:'bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg transform active:scale-95'}`}
          disabled={!buzzEnabled || buzzed}
        >
          {!buzzEnabled?'WAITING...':buzzed?(isFirstBuzzer?'WINNER!':'BUZZED!'):'BUZZ'}
        </button>
      </div>
      <div className="w-full md:w-1/4 md:pl-4 order-2 md:order-3">
        <DialogBox 
          title="Buzz Order" 
          items={buzzOrder} 
          highlightFirstThree={true}
        />
        {isFirstBuzzer && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg animate-fade-in">
            <p className="text-center font-bold text-yellow-800">🏆 You buzzed first! 🏆</p>
            <p className="text-center text-yellow-700 mt-2">Wait for few seconds,our coordinators will reach you soon😊</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buzz;