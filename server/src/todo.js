const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    createdAt: {
      type: Number,
      default: Date.now(),
    },
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
