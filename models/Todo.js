const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isEdit: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  userId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  date: { type: Date, required: true },
});

todoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Todo", todoSchema);
