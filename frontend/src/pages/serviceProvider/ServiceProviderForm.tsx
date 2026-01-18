import { useEffect, useState } from "react";
import { applyServiceProviderApi } from "../../api/serviceProvider.api";
import { Loader2, UploadCloud } from "lucide-react";
import { useDispatch } from "react-redux";
import { setApplication } from "../../features/provider/providerSlice";

const ServiceProviderForm = ({ editMode, initialData, onSuccess }: any) => {
  const dispatch = useDispatch();

  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setBusinessName(initialData.businessName || "");
      setPhone(initialData.businessPhone || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("businessName", businessName);
    if (phone) formData.append("phone", phone);

    if (aadhaar) {
      formData.append("documents", aadhaar);
      formData.append("documentTypes", "Aadhaar");
    }

    if (pan) {
      formData.append("documents", pan);
      formData.append("documentTypes", "PAN");
    }

    try {
      setLoading(true);
      const res = await applyServiceProviderApi(formData);
      dispatch(setApplication(res.data.application));
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {editMode ? "Edit Service Provider Application" : "Apply as Service Provider"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please provide accurate business and document details.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Business Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ABC Services Pvt Ltd"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Upload Documents
          </h3>

          {/* Aadhaar */}
          <label className="flex items-center justify-between gap-4 rounded-xl border border-dashed p-4 cursor-pointer hover:border-indigo-400 transition">
            <div>
              <p className="text-sm font-medium text-gray-700">Aadhaar Card</p>
              <p className="text-xs text-gray-500">
                PDF / JPG / PNG
              </p>
              {aadhaar && (
                <p className="text-xs text-indigo-600 mt-1">
                  {aadhaar.name}
                </p>
              )}
            </div>
            <UploadCloud className="text-gray-400" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setAadhaar(e.target.files?.[0] || null)}
            />
          </label>

          {/* PAN */}
          <label className="flex items-center justify-between gap-4 rounded-xl border border-dashed p-4 cursor-pointer hover:border-indigo-400 transition">
            <div>
              <p className="text-sm font-medium text-gray-700">PAN Card</p>
              <p className="text-xs text-gray-500">
                PDF / JPG / PNG
              </p>
              {pan && (
                <p className="text-xs text-indigo-600 mt-1">
                  {pan.name}
                </p>
              )}
            </div>
            <UploadCloud className="text-gray-400" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setPan(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading && <Loader2 className="animate-spin h-5 w-5" />}
          {editMode ? "Update Application" : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;
