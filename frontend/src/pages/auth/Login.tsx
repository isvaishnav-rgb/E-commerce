import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth.schema";
import { loginApi, meApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  /* -------------------------
     SUBMIT
  -------------------------- */
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError(null);

      const res = await loginApi(data);
      

      const { accessToken, refreshToken } = res.data;

      // ✅ Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // ✅ Sync Redux
      dispatch(loginSuccess(res.data));

      const resUser = await meApi();
      dispatch(setUser(resUser.data))

      // ✅ Show success message
      setSuccessMessage("🎉 Login successful! Redirecting...");

      // ⏳ Navigate after delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<any>;
      setServerError(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     UI
  -------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>

        {/* ✅ Success Message */}
        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700 text-center">
            {successMessage}
          </div>
        )}

        {/* 🔴 Error Message */}
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600 text-center">
            {serverError}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            disabled={!!successMessage}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-indigo-300"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            disabled={!!successMessage}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-indigo-300"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !!successMessage}
          className="w-full rounded-md bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {successMessage
            ? "Logged in ✓"
            : loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
