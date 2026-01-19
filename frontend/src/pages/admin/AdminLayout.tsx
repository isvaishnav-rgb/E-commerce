import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
