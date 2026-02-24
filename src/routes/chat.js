const express = require("express");
const Chat = require("../models/chat");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequestSchema");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await Chat.findOne({
      participates: { $all: [userId, targetUserId] },
    })
      .populate("message.senderId", "firstName lastName")
      .populate("participates", "firstName lastName photoUrl");

    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    });
    console.log(connection);
    if (!connection) {
      throw new Error("you do not have connection with him/her");
    }

    if (!chat) {
      chat = new Chat({
        participates: [userId, targetUserId],
        message: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = chatRouter;
