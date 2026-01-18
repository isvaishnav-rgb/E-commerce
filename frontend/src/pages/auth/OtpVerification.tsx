import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "../../schemas/auth.schema";
import { meApi, verifyOtpApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export default function OtpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  /* -------------------------------
     Guard Direct Access
  -------------------------------- */
  useEffect(() => {
    if (!state?.email) {
      navigate("/signup");
    }
  }, [state, navigate]);

  /* -------------------------------
     React Hook Form
  -------------------------------- */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: state?.email || "",
      otp: "",
    },
  });

  /* -------------------------------
     OTP HANDLERS
  -------------------------------- */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);
    setValue("otp", pasted);

    newOtp.forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = digit;
      }
    });
  };

  /* -------------------------------
     SUBMIT
  -------------------------------- */
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError(null);

      const res = await verifyOtpApi(data);
      
      const { accessToken, refreshToken } = res.data;

      // ✅ STORE TOKENS IN LOCAL STORAGE
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(loginSuccess(res.data));

      const resUser = await meApi();
      dispatch(setUser(resUser.data))

      // ✅ Success message
      setSuccessMessage("🎉 Your account has been verified successfully!");

      // ⏳ Redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<any>;
      setServerError(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email 📩
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

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
        <input
          {...register("email")}
          disabled
          className="w-full mb-4 rounded-md border bg-gray-100 px-3 py-2 text-sm cursor-not-allowed"
        />

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-4">
          {otp.map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={!!successMessage}
              className={`w-12 h-12 text-center text-lg font-semibold rounded-md border focus:outline-none focus:ring-2 ${
                errors.otp
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-300"
              }`}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-xs text-red-500 text-center mb-4">
            {errors.otp.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !!successMessage}
          className="w-full rounded-md bg-indigo-600 py-2 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {successMessage
            ? "Verified ✓"
            : loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive OTP?{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </form>
    </div>
  );
}
