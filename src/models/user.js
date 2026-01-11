const mongoose = require("mongoose");
const validator = require("validator");

const userShema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
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
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender data is not valid");
        }
      },
      min: 16,
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
  }
);

module.exports = mongoose.model("User", userShema);
