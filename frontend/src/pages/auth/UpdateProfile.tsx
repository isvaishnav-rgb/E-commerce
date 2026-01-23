// src/pages/profile/UpdateProfile.tsx
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../../schemas/updateProfile.schema";
import { updateProfileApi } from "../../api/auth.api";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
} from "@mui/material";

type UpdateProfileForm = {
  name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
};

export default function UpdateProfile() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || "",
      phone: user.phone || "",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
        pincode: user.address?.pincode || "",
      },
    });
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await updateProfileApi(data);
      dispatch(setUser(res.data.user));
      setSuccess("✅ Profile updated successfully!");

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const e = err as AxiosError<any>;
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
        bgcolor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            Update Profile ✨
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {/* Name */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    size="small"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />

              {/* Address */}
              <Typography variant="subtitle1" fontWeight={600}>
                Address
              </Typography>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street"
                    fullWidth
                    size="small"
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
              <Stack direction="row" spacing={2}>
                <Controller
                  name="address.city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      fullWidth
                      size="small"
                      error={!!errors.address?.city}
                      helperText={errors.address?.city?.message}
                    />
                  )}
                />
                <Controller
                  name="address.state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="State"
                      fullWidth
                      size="small"
                      error={!!errors.address?.state}
                      helperText={errors.address?.state?.message}
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Controller
                  name="address.country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      fullWidth
                      size="small"
                      error={!!errors.address?.country}
                      helperText={errors.address?.country?.message}
                    />
                  )}
                />
                <Controller
                  name="address.pincode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Pincode"
                      fullWidth
                      size="small"
                      error={!!errors.address?.pincode}
                      helperText={errors.address?.pincode?.message}
                    />
                  )}
                />
              </Stack>

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
