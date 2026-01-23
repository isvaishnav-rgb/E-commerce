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
    let isMounted = true;

    const fetchApplication = async () => {
      try {
        const res = await getMyServiceProviderApplicationApi();

        if (isMounted) {
          dispatch(setApplication(res?.data?.application ?? null));
        }
      } catch (err) {
        console.error("FETCH APPLICATION ERROR", err);
        if (isMounted) {
          dispatch(setApplication(null));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  /* ⏳ Loading */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  /* 📝 No application OR editing */
  if (!application || editMode) {
    return (
      <ServiceProviderForm
        editMode={Boolean(application)}
        initialData={application}
        onSuccess={() => {
          setEditMode(false);
        }}
      />
    );
  }

  /* 📄 Application exists */
  return (
    <ApplicationDetails
      application={application}
      onEdit={() => setEditMode(true)}
    />
  );
};

export default ServiceProviderPage;
