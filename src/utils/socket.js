const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const generateRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  const roomId = crypto
    .createHash("sha256")
    .update(sortedIds.join("_"))
    .digest("hex");
  return roomId;
};

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = generateRoomId(userId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = generateRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participates: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participates: [userId, targetUserId],
              message: [],
            });
          }

          chat.message.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageRecived", { firstName, text });
        } catch (err) {
          console.log(err);
        }
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initilizeSocket;
