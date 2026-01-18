import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface Props {
  allowedRoles: ("admin" | "provider" | "user")[];
}

const RoleRoute = ({ allowedRoles }: Props) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleRoute;
