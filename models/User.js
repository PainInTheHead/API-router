const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    }
  });
  
  module.exports = mongoose.model("User", userSchema);