import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <div></div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
