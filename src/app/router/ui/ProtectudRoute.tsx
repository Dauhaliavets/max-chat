import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../../contexts/appContext/appContext";

export const ProtectedRoute = () => {
  const { credentials } = useAppContext();

  if (!credentials) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};
