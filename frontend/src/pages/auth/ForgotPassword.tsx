import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { forgotPasswordThunk } from "../../features/auth/authThunks";

/* -----------------------
   ZOD SCHEMA
------------------------ */
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(forgotPasswordThunk(data)).unwrap();
      setSuccess(
        "If this email exists, a password reset link has been sent."
      );
      reset();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        <p className="text-gray-500 mb-4">
          Enter your registered email address
        </p>

        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full border p-2 rounded focus:ring"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
