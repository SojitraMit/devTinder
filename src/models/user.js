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
      required: true,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not a valid gender type",
      },
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("gender data is not valid");
      //   }
      // },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      default: "None",
      enum: {
        values: ["None", "Silver", "Gold"],
        message: "{VALUE} is not a valid membership type",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/3e/49/bc/3e49bca5dfe7083928a95d69bec59c1d.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photoUrl  is not valid ");
        }
      },
    },
    gitHubUrl: {
      type: String,
      default: "https://github.com/",
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("gitHubUrl  is not valid ");
        }
      },
    },
    linkedInUrl: {
      type: String,
      default: "https://www.linkedin.com/",
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("linkedInUrl  is not valid ");
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
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
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
