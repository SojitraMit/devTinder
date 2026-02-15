const socket = require("socket.io");

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
