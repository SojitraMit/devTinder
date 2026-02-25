const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
require("dotenv").config();

app.use(
  cors({
    origin: "https://dev-tinder-web-mocha.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initilizeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initilizeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log(`server is active at port ${process.env.PORT}....`);
    });
  })
  .catch((err) => {
    console.error("Database can not be connected");
  });
