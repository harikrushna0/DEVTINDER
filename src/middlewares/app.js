const express = require("express");
const connectDB = require("../config/database");
const UserSchema = require("../model/user");
const app = express();

//run on every request
//use middleware to parse json body data
app.use(express.json());

app.post("/signup", async (req, res) => {
  
  //creating a new instance of the user model
  const user = new UserSchema(req.body);
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
