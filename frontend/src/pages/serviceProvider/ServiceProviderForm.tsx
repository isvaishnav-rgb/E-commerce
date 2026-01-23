import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          {editMode ? "Edit Application" : "Apply as Service Provider"}
        </h2>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        {/* BUSINESS NAME */}
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <input
            {...register("businessName")}
            className="w-full border rounded px-4 py-2"
          />
          {errors.businessName && (
            <p className="text-red-600 text-sm">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            {...register("phone")}
            className="w-full border rounded px-4 py-2"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* AADHAAR */}
        <div>
          <label className="flex items-center gap-4 border-dashed border p-4 rounded cursor-pointer">
            <UploadCloud />
            Aadhaar Upload
            <input
              type="file"
              hidden
              onChange={(e) =>
                setValue("aadhaar", e.target.files?.[0])
              }
            />
          </label>
          {errors.aadhaar && (
            <p className="text-red-600 text-sm">
              {errors.aadhaar.message}
            </p>
          )}
        </div>

        {/* PAN */}
        <div>
          <label className="flex items-center gap-4 border-dashed border p-4 rounded cursor-pointer">
            <UploadCloud />
            PAN Upload
            <input
              type="file"
              hidden
              onChange={(e) =>
                setValue("pan", e.target.files?.[0])
              }
            />
          </label>
          {errors.pan && (
            <p className="text-red-600 text-sm">
              {errors.pan.message}
            </p>
          )}
        </div>

        {/* SUBMIT */}
        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          {isSubmitting && (
            <Loader2 className="inline mr-2 animate-spin" />
          )}
          {editMode ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;
