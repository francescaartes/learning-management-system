import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <div></div>;

  return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
