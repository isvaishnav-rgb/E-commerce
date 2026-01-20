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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Users
        </h1>
        <p className="text-sm text-gray-500">
          Total: {users.length}
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
