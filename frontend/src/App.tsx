import { meApi } from "./api/auth.api";
import { setUser, logout, loginSuccess } from "./features/auth/authSlice";
import Header from "./modules/Header";
import Footer from "./modules/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchActiveProducts } from "./features/product/productSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken")
      if (!token) return;
      if (!refreshToken) return;

      try {
        const res = await meApi();
        dispatch(loginSuccess({ getAccessToken: token, refreshToken }))
        dispatch(setUser(res.data));
       dispatch(fetchActiveProducts());
      } catch {
        dispatch(logout());
      }
    };

    initAuth();
  }, []);

  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
