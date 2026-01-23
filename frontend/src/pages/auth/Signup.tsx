import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../schemas/auth.schema";
import { signupApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Container,
} from "@mui/material";

export default function Signup() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError(null);
      setSuccessMessage(null);

      await signupApi(data);

      setSuccessMessage("🎉 Signup successful! OTP sent to your email.");

      setTimeout(() => {
        navigate("/verify", { state: { email: data.email } });
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<any>;
      setServerError(error.response?.data?.message || "Signup failed");
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
        background: "linear-gradient(135deg, #eef2ff, #ffffff)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            Create Account 🚀
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Name */}
              <TextField
                label="Name"
                placeholder="John Doe"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              {/* Email */}
              <TextField
                label="Email"
                type="email"
                placeholder="you@example.com"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              {/* Phone */}
              <TextField
                label="Phone"
                placeholder="9876543210"
                fullWidth
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              {/* Password */}
              <TextField
                label="Password"
                type="password"
                placeholder="••••••••"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading || !!successMessage}
              >
                {loading
                  ? "Creating account..."
                  : successMessage
                  ? "OTP Sent ✓"
                  : "Sign Up"}
              </Button>
            </Stack>
          </form>

          <Typography
            textAlign="center"
            variant="body2"
            color="text.secondary"
            mt={3}
          >
            Already have an account?{" "}
            <Box
              component="span"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
