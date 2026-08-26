import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

function NotFound() {
  return (
    <main>
      <div className="form-container">
        <h1>404</h1>
        <p>Page not found.</p>
        <a href="/login">Go to Login</a>
      </div>
    </main>
  );
}

function Root() {
  return <Login />;
}

export const router = createBrowserRouter([

  {
    path: "/",
    element: <Root />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />
  },
  {
    path: "*",
    element: <NotFound />
  }

])
