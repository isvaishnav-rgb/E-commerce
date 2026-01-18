import axios from "axios";
import { store } from "../app/store";
import { logout, setAccessToken } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

/* -----------------------
   REQUEST INTERCEPTOR
------------------------ */
api.interceptors.request.use((config) => {
  const stateToken = store.getState().auth.accessToken;
  const token = stateToken || localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(config)

  return config;
});

/* -----------------------
   RESPONSE INTERCEPTOR
------------------------ */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          store.getState().auth.refreshToken ||
          localStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://localhost:3000/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // ✅ Update Redux + localStorage
        store.dispatch(setAccessToken(newAccessToken));
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        store.dispatch(logout());
        localStorage.clear();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
