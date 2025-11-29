const express = require("express");
const connectDB = require("../config/database");
const UserSchema = require("../model/user");
const app = express();

app.post("/signup", async (req, res) => {
  //creating a new instance of the user model
  const user = new UserSchema({
    firstName: "Harikrushna",
    lastName: "Suhagiya",
    emailId: "harikrushnasuhagiya59@gmail.com",
    password: "hari@123",
  });

  try {
    //return a promise.
    await user.save();
    res.send("user added succesfully ..");
  } catch (err) {
    res.status(500).send("Error while saving user : ", err.message);
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
