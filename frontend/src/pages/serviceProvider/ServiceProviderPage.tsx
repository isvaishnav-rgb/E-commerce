import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyServiceProviderApplicationApi } from "../../api/serviceProvider.api";
import { setApplication } from "../../features/provider/providerSlice";
import ServiceProviderForm from "./ServiceProviderForm";
import ApplicationDetails from "./ApplicationDetails";
import { Loader2 } from "lucide-react";

const ServiceProviderPage = () => {
  const dispatch = useDispatch();
  const application = useSelector(
    (state: any) => state.provider.application
  );

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await getMyServiceProviderApplicationApi();
        dispatch(setApplication(res.data.application || null));
      } catch {
        dispatch(setApplication(null));
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  /* ❌ NOT APPLIED OR EDIT MODE */
  if (!application || editMode) {
    return (
      <ServiceProviderForm
        editMode={!!application}
        initialData={application}
        onSuccess={() => setEditMode(false)}
      />
    );
  }

  /* ✅ PENDING / APPROVED */
  return (
    <ApplicationDetails
      application={application}
      onEdit={() => setEditMode(true)}
    />
  );
};

export default ServiceProviderPage;
