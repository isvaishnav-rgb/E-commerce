import { Mail, Phone, User, ShieldCheck } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-6 bg-white rounded-2xl shadow-md p-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-indigo-500/30">
            {firstLetter}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>

            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <ShieldCheck size={16} />
              Active Account
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <User />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Mail />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Phone />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {user?.phone || "Not added"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <ShieldCheck />
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize text-gray-900">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/update-profile"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Edit Profile
          </Link>

          <Link
            to="/change-password"
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Change Password
          </Link>
        </div>

      </div>
    </div>
  );
}
