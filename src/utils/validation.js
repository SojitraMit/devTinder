const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("please enter the name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid! ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stronge password!");
  } else if (age < 0 || age > 150) {
    throw new Error("Please enter a valid age!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
