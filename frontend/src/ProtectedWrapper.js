import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./AuthContext";

function ProtectedWrapper() {
  const { user } = useContext(AuthContext);

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the nested routes (Layout with children)
  return <Outlet />;
}

export default ProtectedWrapper;
