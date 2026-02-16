const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema({
  participates: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  message: [messageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
