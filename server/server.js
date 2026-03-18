//Backend for the To-do list
require("dotenv").config();

import apiRouter from "./routes/api.js";
import userRouter from "./routes/user.js";

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
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.use("/api/todo", apiRouter);
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
