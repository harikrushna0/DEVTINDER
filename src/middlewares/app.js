const express = require("express");
const connectDB = require("../config/database");
const UserSchema = require("../model/user");
const { tr } = require("@faker-js/faker");
const app = express();

//run on every request
//use middleware to parse json body data
app.use(express.json());

//get one user by emailid
app.get("/user",async(req,res)=>{
  const emailId=req.body.emailId;
  try{
    const user=await UserSchema.findOne({emailId:emailId});
    if(user){
      res.status(200).json({message:"user fetched successfully",data:user});
    }else{
      res.status(404).json({message:"user not found"});
    }
  }
  catch(err){
    res.status(500).json({message:"error while fetching user",data:err.message});
  }
});

//feed api -get all the user on page loads on first time when we login in devTinder
app.get("/feed", async (req, res) => {
  try {
    const users = await UserSchema.find({});
    res
      .status(200)
      .json({ message: "users fetched successfully", data: users });
  } catch (err) {
    res.status(404).json({ message: "users not found", data: err.message });
  }
});

// delete api
app.delete("/user",async(req,res)=>{
  const userId = req.query.userId;
  try{
    const deletedUser= await UserSchema.findByIdAndDelete(userId);
    if(deletedUser){
      res.status(200).json({message:"user deleted successfully",data:deletedUser});
    }else{
      res.status(404).json({message:"user not found"});
    }
  }
  catch(err){
    res.status(500).json({message:"error while deleting user",data:err.message});
  }
})

//update api
app.patch("/user",async(req,res)=>{

  const emailId= req.body.emailId;
  const data = req.body;

  try{
    await UserSchema.findOneAndUpdate({emailId:emailId},data);
    res.status(200).json({message:"user updated successfully"});
  }
  catch(err){
    res.status(500).json({message:"error while updating user",data:err.message});
  }
  
  

});

//signup api
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
