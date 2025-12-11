const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://202101214:CsVNHRtX5f5PwjLG@namastenodejs.m3m15um.mongodb.net/devTinder"
    );
    // console.log("DB connected successfully");
  } catch (err) {
    console.log("Error in DB connection" + err.message);
  }
};

module.exports = connectDB;
