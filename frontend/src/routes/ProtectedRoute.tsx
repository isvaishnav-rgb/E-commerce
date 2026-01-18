import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = () => {
  const isReduxAuth = useAppSelector(
    (state) => state.auth.isAuthenticated
  );
  const hasToken = !!localStorage.getItem("accessToken");
  return isReduxAuth || hasToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
