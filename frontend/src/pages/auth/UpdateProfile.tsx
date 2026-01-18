import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../../schemas/updateProfile.schema";
import { updateProfileApi } from "../../api/auth.api";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import type { AxiosError } from "axios";

export default function UpdateProfile() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const payload = data.password ? data : { ...data, password: undefined };
      const res = await updateProfileApi(payload);

      dispatch(setUser(res.data.user));
      setSuccess("✅ Profile updated successfully!");
    } catch (err) {
      const e = err as AxiosError<any>;
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Profile ✨
        </h2>

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm text-center">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
