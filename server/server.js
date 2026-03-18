//Backend for the To-do list
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

//Middleware
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No toen provided" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

let todos = [];
let nextId = 1;

//Register to create an account
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hPassword],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

//Logging in as a user
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  //Check the user
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  //Check the password
  const validPassword = bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  //Create a token for the user
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token });
});

//Request all the to-dos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

//Add a to-do
app.post("/api/todos", (req, res) => {
  const todo = { id: nextId++, text: req.body.text, completed: false };
  todos.push(todo);
  res.json(todo);
});

//Mark a to-do complete
app.put("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todo.completed = true;
  res.json(todo);
});

//Delete a to-do
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== parseInt(req.params.id));
  res.json(todos);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
