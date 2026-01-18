import { FileText, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: any = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
};

const ApplicationDetails = ({ application, onEdit }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Service Provider Application
          </h2>

          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              statusStyles[application.status]
            }`}
          >
            {application.status}
          </span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Business Name</p>
            <p className="font-semibold text-gray-800">
              {application.businessName}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">
              {application.businessPhone || "N/A"}
            </p>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">
            Uploaded Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {application.kycDocuments.map((doc: any, idx: number) => (
              <a
                key={idx}
                href={doc.documentImage}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border p-4 hover:border-indigo-500 transition"
              >
                <FileText className="text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-800">{doc.type}</p>
                  <p className="text-xs text-indigo-600 underline">
                    View document
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Action */}
        {application.status === "Pending" && (
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
          >
            <Edit3 size={18} />
            Edit Application
          </button>
        )}
          {/* Action */}
        {application.status === "Approved" && (
          <Link to="/service-provider/dashboard">
          <button
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
          >
            Service Provider DashBoard
          </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
