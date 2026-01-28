import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { serviceProviderSchema } from "../../schemas/serviceProvider.schema";
import type { ServiceProviderFormData } from "../../schemas/serviceProvider.schema";
import { applyServiceProviderApi } from "../../api/serviceProvider.api";
import { setApplication } from "../../features/provider/providerSlice";

type Props = {
  editMode?: boolean;
  initialData?: any;
  onSuccess?: () => void;
};

const ServiceProviderForm = ({
  editMode = false,
  initialData,
  onSuccess,
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [success, setSuccess] = useState<string | null>(null);
  const [aadhaarFileName, setAadhaarFileName] = useState<string | null>(null);
  const [panFileName, setPanFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      businessName: "",
      phone: "",
    },
  });

  /* Prefill edit mode */
  useEffect(() => {
    if (initialData) {
      setValue("businessName", initialData.businessName ?? "");
      setValue("phone", initialData.businessPhone ?? "");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: ServiceProviderFormData) => {
    const formData = new FormData();

    formData.append("businessName", data.businessName);
    if (data.phone) formData.append("phone", data.phone);

    if (data.aadhaar) {
      formData.append("documents", data.aadhaar);
      formData.append("documentTypes", "Aadhaar");
    }

    if (data.pan) {
      formData.append("documents", data.pan);
      formData.append("documentTypes", "PAN");
    }

    const res = await applyServiceProviderApi(formData);
    dispatch(setApplication(res.data.application));

    setSuccess(
      editMode
        ? "Application updated successfully"
        : "Application submitted successfully"
    );

    setTimeout(() => {
      setSuccess(null);
      onSuccess?.();
      navigate("/");
    }, 3000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f9fafb"
      px={2}
    >
      <Card sx={{ width: "100%", maxWidth: 600, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3}>
            {editMode ? "Edit Application" : "Apply as Service Provider"}
          </Typography>

          {/* SUCCESS */}
          {success && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 2 }}
            >
              {success}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* BUSINESS NAME */}
            <TextField
              label="Business Name"
              fullWidth
              {...register("businessName")}
              error={!!errors.businessName}
              helperText={errors.businessName?.message}
            />

            {/* PHONE */}
            <TextField
              label="Phone"
              fullWidth
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* AADHAAR UPLOAD */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  justifyContent: "flex-start",
                  py: 1.5,
                  borderStyle: "dashed",
                }}
              >
                Aadhaar Upload
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("aadhaar", file);
                      setAadhaarFileName(file.name);
                    }
                  }}
                />
              </Button>

              {aadhaarFileName && (
                <Typography variant="body2" mt={0.5} color="text.secondary">
                  Selected: <strong>{aadhaarFileName}</strong>
                </Typography>
              )}

              {errors.aadhaar && (
                <Typography variant="caption" color="error">
                  {errors.aadhaar.message}
                </Typography>
              )}
            </Box>

            {/* PAN UPLOAD */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  justifyContent: "flex-start",
                  py: 1.5,
                  borderStyle: "dashed",
                }}
              >
                PAN Upload
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("pan", file);
                      setPanFileName(file.name);
                    }
                  }}
                />
              </Button>

              {panFileName && (
                <Typography variant="body2" mt={0.5} color="text.secondary">
                  Selected: <strong>{panFileName}</strong>
                </Typography>
              )}

              {errors.pan && (
                <Typography variant="caption" color="error">
                  {errors.pan.message}
                </Typography>
              )}
            </Box>

            {/* SUBMIT */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : editMode ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceProviderForm;
