import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schemas/auth.schema";
import { changePasswordApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import type { AxiosError } from "axios";

export default function ChangePassword() {
  const dispatch = useDispatch();

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      await changePasswordApi(data);

      setSuccess("✅ Password changed successfully. Please login again.");

      reset();

      setTimeout(() => {
        dispatch(logout());
      }, 2000);
    } catch (err) {
      const e = err as AxiosError<any>;
      setError(e.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Change Password 🔐
        </h2>

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700 text-center">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* CURRENT PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            {...register("currentPassword")}
            type="password"
            placeholder="••••••••"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 ${
              errors.currentPassword
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-indigo-300"
            }`}
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            {...register("newPassword")}
            type="password"
            placeholder="At least 8 characters"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 ${
              errors.newPassword
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-indigo-300"
            }`}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You’ll be logged out after changing your password.
        </p>
      </form>
    </div>
  );
}
