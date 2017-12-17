var mongoose = require("mongoose")

module.exports = mongoose.model("User" , new mongoose.Schema({
  username : {type:String, unique:true},
  password : String,
  token : String,
  expiration : {type:Number, min:0}
}))