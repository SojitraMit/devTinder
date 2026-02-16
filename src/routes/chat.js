const express = require("express");
const Chat = require("../models/chat");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await Chat.findOne({
      participates: { $all: [userId, targetUserId] },
    }).populate("message.senderId", "firstName lastName");

    if (!chat) {
      chat = new Chat({
        participates: [userId, targetUserId],
        message: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {}
});

module.exports = chatRouter;
