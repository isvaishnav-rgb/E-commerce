import { meApi } from "./api/auth.api";
import { setUser, logout, loginSuccess } from "./features/auth/authSlice";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchActiveProducts } from "./features/product/productSlice";
import { useSearchParams } from "react-router-dom";
import Header from "./modules/Header";
import Footer from "./modules/Footer";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

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
      } catch {
        dispatch(logout());
      }
    };

    initAuth();
  }, []);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = () => {
     dispatch(fetchActiveProducts())
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <>
     <Toaster position="top-right" reverseOrder={false}/>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
