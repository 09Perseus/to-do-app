//User account creation
//Register to create an account
userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
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
userRouter.post("/login", async (req, res) => {
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

export default userRouter;
