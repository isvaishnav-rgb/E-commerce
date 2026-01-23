import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schemas/auth.schema";
import { changePasswordApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import type { AxiosError } from "axios";

import { TextField, Button, Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const dispatch = useDispatch();

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate("/login")
      }, 2000);
    } catch (err) {
      const e = err as AxiosError<any>;
      setError(e.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
          Change Password 🔐
        </Typography>

        {/* SUCCESS */}
        {success && (
          <Alert severity="success" sx={{ mb: 2, textAlign: "center" }}>
            {success}
          </Alert>
        )}

        {/* ERROR */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Alert>
        )}

        {/* CURRENT PASSWORD */}
        <TextField
          label="Current Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("currentPassword")}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message?.toString() || " "}
        />

        {/* NEW PASSWORD */}
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message?.toString() || "At least 8 characters"}
        />

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>

        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          textAlign="center"
          mt={2}
        >
          You’ll be logged out after changing your password.
        </Typography>
      </Box>
    </Box>
  );
}
