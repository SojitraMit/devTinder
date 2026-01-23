const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request!!");
    }
    if (req.body?.skills?.length > 10) {
      throw new Error("Skils cannot be more than 10 ");
    }

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // await User.findByIdAndUpdate(userId, data, {
    //   returnDocument: "before",
    //   runValidators: true,
    // });

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const loggedInUser = req.user;

  try {
    const isPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (isPasswordValid) {
      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Please enter a strong password!");
      }
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      loggedInUser["password"] = newPasswordHash;
      await loggedInUser.save();
      res.send(
        `${loggedInUser.firstName}, your password updated successfully!`,
      );
    } else {
      throw new Error("Old password is incorrect");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
