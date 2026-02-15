const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const razorpayInstance = require("../utils/razorpay");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[req.body.plan] * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        membershipType: req.body.plan,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      membershipType: req.body.plan,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({ ...savedPayment, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: error || "Error creating payment" });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      req.headers["x-razorpay-signature"],
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    if (req.body.event === "payment.captured") {
      const user = await User.findOne({ _id: payment.userId });
      user.isPremium = true;
      user.membershipType = payment.membershipType;
      await user.save();
    }
    if (req.body.event === "payment.failed") {
    }
  } catch (error) {
    console.error("Error in webhook:", error);
    res.status(500).json({ message: error || "Error in webhook" });
  }
});

paymentRouter.post("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  user.isPremium = true;
  user.membershipType = req.body.plan;
  await user.save();
  res.json({ data: req.user });
});

module.exports = paymentRouter;
