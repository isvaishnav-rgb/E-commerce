import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth.schema";
import { loginApi, meApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError(null);

      const res = await loginApi(data);
      const { accessToken, refreshToken } = res.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(loginSuccess(res.data));

      const resUser = await meApi();
      dispatch(setUser(resUser.data));

      setSuccessMessage("🎉 Login successful! Redirecting...");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const error = err as AxiosError<any>;
      setServerError(error.response?.data?.message || "Login failed");
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
        bgcolor: "grey.100",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Welcome Back 👋
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} variant="outlined">
            {successMessage}
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }} variant="outlined">
            {serverError}
          </Alert>
        )}

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              placeholder="you@example.com"
              fullWidth
              disabled={!!successMessage}
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
              margin="normal"
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              placeholder="••••••••"
              fullWidth
              disabled={!!successMessage}
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
              margin="normal"
            />
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={loading || !!successMessage}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {successMessage
            ? "Logged in ✓"
            : loading
            ? "Logging in..."
            : "Login"}
        </Button>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#4f46e5", textDecoration: "underline" }}>
            Sign up
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
          Forgot your password?{" "}
          <Link to="/forgot-password" style={{ color: "#4f46e5", textDecoration: "underline" }}>
            Reset here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
