import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "../../schemas/auth.schema";
import { meApi, verifyOtpApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function OtpVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Guard direct access
  useEffect(() => {
    if (!state?.email) {
      navigate("/signup");
    }
  }, [state, navigate]);

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

  // OTP Handlers
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

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError(null);

      const res = await verifyOtpApi(data);
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(loginSuccess(res.data));
      const resUser = await meApi();
      dispatch(setUser(resUser.data));

      setSuccessMessage("🎉 Your account has been verified successfully!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<any>;
      setServerError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f3f4f6", // gray-100
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Verify Your Email 📩
        </Typography>
        <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
          Enter the 6-digit OTP sent to your email
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        {/* Email Field */}
        <TextField
          fullWidth
          disabled
          {...register("email")}
          sx={{ mb: 3 }}
        />

        {/* OTP Inputs */}
        <Box display="flex" justifyContent="space-between" mb={3} sx={{gap: "15px"}}>
          {otp.map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputsRef.current[index] = el)}
              value={otp[index]}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, index)}
              onPaste={handlePaste}
              disabled={!!successMessage}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "1.25rem", width: "3rem", height: "1rem" },
              }}
              error={!!errors.otp}
            />
          ))}
        </Box>
        {errors.otp && (
          <Typography variant="caption" color="error" textAlign="center" display="block" mb={2}>
            {errors.otp.message}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading || !!successMessage}
        >
          {successMessage
            ? "Verified ✓"
            : loading
            ? "Verifying..."
            : "Verify OTP"}
        </Button>

        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
          Didn’t receive OTP?{" "}
          <Box component="span" sx={{ color: "primary.main", cursor: "pointer", textDecoration: "underline" }}>
            Resend
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
