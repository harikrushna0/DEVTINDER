const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required:true,
    unique:true,
  },
  password: {
    type: String,
    required:true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  about:{
    type:String,
    default:" Hey there! I am using DevTinder."
  },
  photoUrl:{
    type:String,
    default:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
  }
},{
    timestamps:true
});

// Model start with capital letter

const UserSchema=mongoose.model("User",userSchema);

module.exports=UserSchema;

//OR

//module.exports=mongoose.model("User",userSchema);