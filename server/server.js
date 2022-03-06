const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/todoList")
  .then((res) => {
    console.log("Mongoose Connection Open");
  })
  .catch((err) => {
    console.log("Mongoose connection Error");
  });

const Todo = require("./src/todo.js");

const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.get("/todos", async (req, res) => {
  const todoList = await Todo.find({});
  res.send(todoList);
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.send(newTodo);
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updatetodo = await Todo.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  res.send("Updated Successfully");
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await Todo.findByIdAndDelete(id);

  res.send(`${deleteTodo} Deleted Successfully`);
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON ${PORT}`);
});
