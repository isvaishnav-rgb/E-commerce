import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProviders } from "../../features/admin/adminThunk";
import { reviewProviderApplicationApi } from "../../api/admin.api";

const ProviderApplications = () => {
  const dispatch = useAppDispatch();
  const providers = useAppSelector((s: any) => s.admin.providers || []);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  if (!Array.isArray(providers)) {
    return <p>Loading provider applications...</p>;
  }

  const review = async (id: string, status: "Approved" | "Rejected") => {
    await reviewProviderApplicationApi(id, { status });
    dispatch(fetchProviders());
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Provider Applications</h1>

      {providers.length === 0 && <p>No applications found</p>}

      {providers.map((p: any) => (
        <div key={p.provider._id} className="border p-4 mb-2">
          <p>{p.provider.name}</p>
          <p>{p.provider.email}</p>

          <button
            onClick={() => review(p.provider._id, "Approved")}
            className="btn-success"
          >
            Accept
          </button>

          <button
            onClick={() => review(p.provider._id, "Rejected")}
            className="btn-danger ml-2"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProviderApplications;
