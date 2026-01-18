import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../features/admin/adminThunk";

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s: any) => s.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Verified</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u: any) => (
              <tr key={u._id} className="text-center">
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.phone || "-"}</td>
                <td className="border p-2 capitalize">{u.role}</td>

                <td className="border p-2">
                  {u.verified ? "✅" : "❌"}
                </td>

                <td className="border p-2">
                  {u.isActive ? "🟢" : "🔴"}
                </td>

                <td className="border p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
