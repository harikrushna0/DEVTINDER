const express = require("express");
const connectDB = require("../config/database");
const UserSchema = require("../model/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//middleware to parse cookie data
app.use(cookieParser());
//run on every request
//use middleware to parse json body data
app.use(express.json());

//get one user by emailid
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await UserSchema.findOne({ emailId: emailId });
    if (user) {
      res.status(200).json({ message: "user fetched successfully" + user });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "error while fetching user" + err.message });
  }
});

//feed api -get all the user on page loads on first time when we login in devTinder
app.get("/feed", async (req, res) => {
  try {
    const users = await UserSchema.find({});
    res.status(200).json({ message: "users fetched successfully" + users });
  } catch (err) {
    res.status(404).json({ message: "users not found" + err.message });
  }
});

// delete api
app.delete("/user", async (req, res) => {
  const userId = req.query.userId;
  try {
    const deletedUser = await UserSchema.findByIdAndDelete(userId);
    if (deletedUser) {
      res
        .status(200)
        .json({ message: "user deleted successfully", data: deletedUser });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "error while deleting user" + err.message });
  }
});

//update api
app.patch("/user", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;

  //api validation
  const AllowedUpdates = ["firstName", "lastName", "password", "age"];

  const requestedUpdates = Object.keys(data).every((k) =>
    AllowedUpdates.includes(k)
  );

  if (!requestedUpdates) {
    throw new Error("invalid updates requested");
  }

  try {
    await UserSchema.findOneAndUpdate({ emailId: emailId }, data);
    res.status(200).json({ message: "user updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error while updating user" + err.message });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      throw new Error("Token is Not Valid");
    }

    const decoded_msg_from_token = await jwt.verify(token, "DevTinder@123");
    const id = decoded_msg_from_token._id;

    const userinfo = await UserSchema.findOne({ _id: id });

    if (!userinfo) {
      throw new Error("User does not exit please login again");
    }

    res.send(userinfo);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
//login api
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await UserSchema.findOne({ emailId: emailId });
  if (!user) {
    return res.status(404).json({ message: "Invalide Credential" });
  }

  const token = await jwt.sign({ _id: user._id }, "DevTinder@123");

  // set cookie without options (defaults apply)
  res.cookie("token", token);
  try {
    if (!user) {
      return res.status(404).json({ message: "Invalide Credential" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", data: user });
  } catch (err) {
    res.status(500).json({ message: "Error during login: " + err.message });
  }
});

//signup api
app.post("/signup", async (req, res) => {
  try {
    //creating a new instance of the user model
    validateSignupData(req);

    const { password } = req.body;
    //encrpt the password

    const hashPassword = await bcrypt.hash(password, 10);

    const data = req.body;

    const user = new UserSchema({
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      password: hashPassword,
    });

    //api validation
    const AllowedUpdates = ["firstName", "lastName", "emailId", "password"];

    const requestedUpdates = Object.keys(data).every((k) =>
      AllowedUpdates.includes(k)
    );

    if (!requestedUpdates) {
      console.log(requestedUpdates);
      res.status(404).send("invalid updates requested");
      return;
    }

    try {
      //return a promise.
      await user.save();
      res.send("user added succesfully ..");
    } catch (err) {
      res.status(500).send("Error while saving user : " + err.message);
    }
  } catch (err) {
    res.status(500).json({ message: "error during signup" + err.message });
  }
});

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("app is listining on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
