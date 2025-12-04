const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required");
  } else if (firstName.length < 4 || firstName.length > 30) {
    throw new Error("First name must be between 4 and 30 characters");
  } else if (lastName.length < 4 || lastName.length > 30) {
    throw new Error("Last name must be between 4 and 30 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email ID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

module.exports = { validateSignupData };
