const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "mit",
    lastName: "sojtra",
    emailId: "mit@gmail.com",
    password: "mit@12345",
  });

  try {
    await user.save();
    res.send("User adding successfully !!");
  } catch (err) {
    res.send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("server is active....");
    });
  })
  .catch((err) => {
    console.error("Database can not be connected");
  });
