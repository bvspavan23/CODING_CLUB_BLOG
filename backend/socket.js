const socketIo = (io) => {
  const roomParticipants = {};
  const buzzOrder = {};
  const buzzEnabled = {};
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("join-room", ({ name, roomId }) => {
      if (!name || !roomId) return;
      socket.join(roomId);
      if (!roomParticipants[roomId]) {
        roomParticipants[roomId] = [];
      }
      // Remove any existing entries for this socket.id
      roomParticipants[roomId] = roomParticipants[roomId].filter(
        (p) => p.socketId !== socket.id
      );
      // Check if this name already exists in the room
      const existingUserIndex = roomParticipants[roomId].findIndex(
        (p) => p.name === name
      );
      if (existingUserIndex === -1) {
        roomParticipants[roomId].push({ name, socketId: socket.id });
        console.log(`${name} joined room ${roomId}`);
        io.to(roomId).emit("user-joined", { name, action: "joined" });
      } else {
        // User reconnecting (update their socket ID
        roomParticipants[roomId][existingUserIndex].socketId = socket.id;
        console.log(`${name} reconnected to room ${roomId}`);
      }
      io.to(roomId).emit("room-users", roomParticipants[roomId]);
    });
    socket.on("buzz", ({ roomId }) => {
      if (!roomId) return;
      const participant = roomParticipants[roomId]?.find(
        (p) => p.socketId === socket.id
      );
      if (!participant) return;
      if (!buzzOrder[roomId]) {
        buzzOrder[roomId] = [];
      }
      if (!buzzOrder[roomId].some((p) => p.socketId === socket.id)) {
        buzzOrder[roomId].push(participant);
        io.to(roomId).emit("buzz-order", buzzOrder[roomId]);
        console.log(
          "Buzz order in",
          roomId,
          ":",
          buzzOrder[roomId].map((p) => p.name)
        );
      }
    });
    socket.on("enable-buzz", ({ roomId }) => {
      if (!roomId) return;
      buzzEnabled[roomId] = true;
      io.to(roomId).emit("buzz-status", { enabled: true });
      console.log(`Buzz enabled in room ${roomId}`);
    });
    socket.on("disable-buzz", ({ roomId }) => {
      if (!roomId) return;
      buzzEnabled[roomId] = false;
      io.to(roomId).emit("buzz-status", { enabled: false });
      console.log(`Buzz disabled in room ${roomId}`);
    });
    socket.on("reset-buzz", ({ roomId }) => {
      if (!roomId) return;
      buzzOrder[roomId] = [];
      io.to(roomId).emit("buzz-order", []);
      console.log(`Buzz order reset in room ${roomId}`);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const roomId in roomParticipants) {
        const index = roomParticipants[roomId].findIndex(
          (p) => p.socketId === socket.id
        );
        if (index !== -1) {
          const [removed] = roomParticipants[roomId].splice(index, 1);
          io.to(roomId).emit("user-left", {
            name: removed.name,
            action: "left",
          });
          io.to(roomId).emit("room-users", roomParticipants[roomId]);
          console.log(`${removed.name} left room ${roomId}`);
        }
      }
      for (const roomId in buzzOrder) {
        buzzOrder[roomId] = buzzOrder[roomId].filter(
          (p) => p.socketId !== socket.id
        );
        io.to(roomId).emit("buzz-order", buzzOrder[roomId]);
      }
    });
  });
};
module.exports = socketIo;
