import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchApplications,
  approveApplication,
  rejectApplication,
} from "../../features/admin/adminThunk";
import { CheckCircle, XCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const ProviderApplications = () => {
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((s: any) => s.admin);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleApprove = async (id: string) => {
    await dispatch(approveApplication({ id }));
    dispatch(fetchApplications());
  };

  const handleReject = async (id: string) => {
    await dispatch(rejectApplication({ id }));
    dispatch(fetchApplications());
  };

  /* Loading State */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Provider Applications
        </h1>
        <p className="text-sm text-gray-500">
          Total: {applications?.length || 0}
        </p>
      </div>

      {/* Empty State */}
      {!applications || applications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No provider applications found
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <div
              key={app._id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {app.user?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {app.user?.email}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <p>
                  <strong>Business:</strong> {app.businessName}
                </p>
                <p>
                  <strong>Applied On:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                {app.adminRemark && (
                  <p className="sm:col-span-2">
                    <strong>Admin Remark:</strong> {app.adminRemark}
                  </p>
                )}
              </div>

              {/* Documents */}
              {app.kycDocuments?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Documents
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {app.kycDocuments.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 bg-gray-50 hover:shadow transition"
                      >
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          {doc.type}
                        </p>

                        <img
                          src={doc.documentImage}
                          alt={doc.type}
                          className="w-full h-32 object-contain rounded cursor-pointer hover:scale-105 transition"
                          onClick={() =>
                            window.open(doc.documentImage, "_blank")
                          }
                        />

                        <p className="text-[11px] text-gray-400 mt-1">
                          ID: {doc.documentNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {app.status === "Pending" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleApprove(app._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(app._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderApplications;
