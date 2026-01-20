import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutApi } from "../api/auth.api";
import { logout } from "../features/auth/authSlice";

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((state) => state?.auth?.refreshToken);

  const handleLogout = async () => {
    if (!refreshToken) {
      dispatch(logout());
      return;
    }

    await logoutApi(refreshToken);
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} className="btn-danger">
      Logout
    </button>
  );
};
