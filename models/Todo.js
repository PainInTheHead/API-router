const mongoose = require("mongoose");


const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isEdit: { type: Boolean, default: false },
    done: { type: Boolean, default: false },
    userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  });
  
  module.exports = mongoose.model("Todo", todoSchema);