import api from "./axios";

export const signupApi = (data: any) =>
  api.post("/auth/signup", data);

export const verifyOtpApi = (data: any) =>
  api.post("/auth/verify-otp", data);

export const loginApi = (data: any) =>
  api.post("/auth/login", data);

export const logoutApi = (refreshToken: string) =>
  api.post("/auth/logout", { refreshToken });

export const updateProfileApi = (data: any) =>
  api.put("/auth/profile", data);

export const changePasswordApi = (data: any) =>
  api.put("/auth/change-password", data);

export const meApi = () =>
  api.get("/auth/me");
