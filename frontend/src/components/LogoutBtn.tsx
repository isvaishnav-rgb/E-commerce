import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "../api/auth.api";
import { logout } from "../features/auth/authSlice";

export const LogoutButton = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state: any) => state.auth.refreshToken);

  const handleLogout = async () => {
    await logoutApi(refreshToken);
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} className="btn-danger">
      Logout
    </button>
  );
};
