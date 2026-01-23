const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userShema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password ");
        }
      },
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://icon-library.com/images/laptop-user-icon/laptop-user-icon-16.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photoUrl  is not valid ");
        }
      },
    },
    about: {
      type: String,
      default: "Hi, I am using DevTinder.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userShema.index({ firstName: 1, lastName: 1 });

userShema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER4321", {
    expiresIn: "7d",
  });

  return token;
};

userShema.methods.validatePassword = async function (passwoerdInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwoerdInputByUser,
    passwordHash,
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userShema);
