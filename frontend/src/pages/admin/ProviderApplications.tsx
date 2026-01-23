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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Provider Applications
        </h1>
        <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {applications?.length || 0}
        </p>
      </div>

      {/* Empty State */}
      {!applications || applications.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white border rounded-xl">
          No provider applications found
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <div
              key={app._id}
              className="bg-white border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-base md:text-lg text-gray-800 truncate">
                    {app.user?.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {app.user?.email}
                  </p>
                </div>

                <span
                  className={`shrink-0 px-2.5 py-0.5 text-[10px] md:text-xs font-semibold rounded-full uppercase tracking-wider ${statusStyles[app.status]}`}
                >
                  {app.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                <p>
                  <strong className="text-gray-900">Business:</strong> {app.businessName}
                </p>
                <p>
                  <strong className="text-gray-900">Applied On:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                {app.adminRemark && (
                  <p className="sm:col-span-2 italic text-gray-600">
                    <strong className="text-gray-900 not-italic">Admin Remark:</strong> {app.adminRemark}
                  </p>
                )}
              </div>

              {/* Documents */}
              {app.kycDocuments?.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">
                    Documents
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {app.kycDocuments.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 bg-white shadow-sm hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-gray-700">
                            {doc.type}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ID: {doc.documentNumber}
                          </p>
                        </div>

                        <div className="relative group overflow-hidden rounded-md bg-gray-100">
                          <img
                            src={doc.documentImage}
                            alt={doc.type}
                            className="w-full h-32 md:h-40 object-contain rounded transition transform group-hover:scale-110 cursor-pointer"
                            onClick={() =>
                              window.open(doc.documentImage, "_blank")
                            }
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xs font-medium">View Full Image</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {app.status === "Pending" && (
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button
                    onClick={() => handleApprove(app._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition cursor-pointer font-bold text-sm"
                  >
                    <CheckCircle size={18} />
                    Approve Application
                  </button>

                  <button
                    onClick={() => handleReject(app._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer font-bold text-sm"
                  >
                    <XCircle size={18} />
                    Reject Application
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
