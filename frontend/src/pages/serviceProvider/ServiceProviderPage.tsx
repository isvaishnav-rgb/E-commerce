import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyServiceProviderApplicationApi } from "../../api/serviceProvider.api";
import { setApplication } from "../../features/provider/providerSlice";
import ServiceProviderForm from "./ServiceProviderForm";
import ApplicationDetails from "./ApplicationDetails";
import { CircularProgress, Box, Container } from "@mui/material";

const ServiceProviderPage = () => {
  const dispatch = useDispatch();
  const application = useSelector((state: any) => state.provider.application);

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
        if (isMounted) dispatch(setApplication(null));
      } finally {
        if (isMounted) setLoading(false);
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
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f9fafb"
      >
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  /* 📝 No application OR editing */
  if (!application || editMode) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <ServiceProviderForm
          editMode={Boolean(application)}
          initialData={application}
          onSuccess={() => setEditMode(false)}
        />
      </Container>
    );
  }

  /* 📄 Application exists */
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <ApplicationDetails
        application={application}
        onEdit={() => setEditMode(true)}
      />
    </Container>
  );
};

export default ServiceProviderPage;
