import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../features/admin/adminThunk";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s: any) => s.admin);

  const userTableHeader = ["Name", "Email", "Phone", "Role", "Verified", "Status", "Joined"]

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Users
        </h1>
        <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {users.length}
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((u: any) => (
          <div key={u._id} className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{u.name}</h3>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
              <span className="shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700">
                {u.role}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs border-t pt-3">
              <div>
                <p className="text-gray-400 mb-1">Phone</p>
                <p className="font-medium text-gray-700">{u.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Joined</p>
                <p className="font-medium text-gray-700">{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Verification</p>
                <span
                  className={`inline-block px-2 py-0.5 font-bold rounded-full ${u.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {u.verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 font-bold rounded-full ${u.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {userTableHeader.map((userTableHeading, index) =>
                  <th className="text-left px-4 py-3" key={index}>{userTableHeading}</th>
                )}
              </tr>
            </thead>

            <tbody>
              {users.map((u: any) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.name}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {u.email}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {u.phone || "-"}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${u.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {u.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right text-gray-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-white border rounded-xl mt-4">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default Users;
