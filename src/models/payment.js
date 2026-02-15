const { default: mongoose } = require("mongoose");
const monnoose = require("mongoose");

const paymentShema = monnoose.Schema(
  {
    userId: {
      type: monnoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentShema);
