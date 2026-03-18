const apiRouter = express.Router();

//Allowing user to edit their to-do list
//Request all the to-dos
apiRouter.get("/", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
    req.user.id,
  ]);
  res.json(result.rows);
});

//Add a to-do
apiRouter.post("/", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "INSERT INTO todos (text, user_id) VALUES ($1, $2) RETURNING *",
    [req.body.text, req.user.id],
  );
  res.json(result.rows[0]);
});

//Mark a to-do complete
apiRouter.put("/:id", authenticateToken, async (req, res) => {
  const result = await pool.query(
    "UPDATE todos SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
    [req.params.id, req.user.id],
  );
  res.json(result.rows[0]);
});

//Delete a to-do
apiRouter.delete("/:id", authenticateToken, async (req, res) => {
  await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [
    req.params.id,
    req.user.id,
  ]);
  res.json({ success: true });
});

export default apiRouter;
