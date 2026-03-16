//Backend for the To-do list
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

//Request all the to-dos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

//Add a to-do
app.post("/api/todos", (req, res) => {
  const todo = { id: nextId++, text: req.nodu.text, completed: false };
  todos.push(todo);
  res.json(todo);
});

//Mark a to-do complete
app.put("api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  todo.completed = true;
  res.json(todo);
});

//Delete a to-do
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id != req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
