const mongoose= require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://202101214:CsVNHRtX5f5PwjLG@namastenodejs.m3m15um.mongodb.net/");
};


module.exports=connectDB;