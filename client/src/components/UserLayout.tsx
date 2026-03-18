//Layout which displays either the login or register component
import { useState } from "react";
//Defining variable to store the API URL for the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UserLayout() {
  return (
    <>
      <h1>UserLayout Page</h1>
    </>
  );
}
