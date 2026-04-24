import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // If already logged in → redirect
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/home"} />;
  }

  return children;
}

export default AuthRoute;