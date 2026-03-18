//Show the form for user login
import { useToken } from "../tokenContext";
import { useState } from "react";
//Defining variable to store the API URL for the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const { token, setToken } = useToken();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //User login
  async function login(e: any): Promise<void> {
    fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => setToken(data.token));
  }
  // send token with every request
  fetch(`${API_URL}/api/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={(e) => login(e)}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" value="Login" />
      </form>
    </>
  );
}
