import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import UserLayout from "./components/UserLayout.tsx";
import { TokenProvider } from "./tokenContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <UserLayout />
        <Register />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <UserLayout />
        <Login />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <TokenProvider>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </TokenProvider>
  </>,
);
