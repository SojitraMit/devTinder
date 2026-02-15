const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    let photoUrl = "";
    if (age < 25 && gender === "Male") {
      photoUrl =
        "https://i.pinimg.com/736x/3e/49/bc/3e49bca5dfe7083928a95d69bec59c1d.jpg";
    } else if (age >= 25 && gender === "Male") {
      photoUrl =
        "https://i.pinimg.com/736x/b6/f3/ad/b6f3adc1329ed86305a2e9240c5e4e13.jpg";
    } else if (age < 25 && gender === "Female") {
      photoUrl =
        "https://img.freepik.com/premium-photo/cute-girl-listening-music-laptop-with-headphone-cartoon-vector-icon-illustration-people-techno_839035-1135921.jpg";
    } else if (age >= 25 && gender === "Female") {
      photoUrl =
        "https://i.pinimg.com/736x/d0/7b/1b/d07b1b4997daf5a2c89d459ede2a4c01.jpg";
    }
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      photoUrl,
      password: passwordHash,
    });
    if (req.body?.skills?.length > 10) {
      throw new Error("Skils cannot be more than 10 ");
    }
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 10 * 36000000),
    });
    res.json({ message: "User adding successfully !!", data: savedUser });
  } catch (err) {
    res.status(400).json({ message: "Error : " + err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid! ");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("EmailId is new to us. Please sign up first.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 36000000),
      });

      res.send(user);
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfull !!");
});

module.exports = authRouter;
