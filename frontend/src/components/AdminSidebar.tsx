import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

const links = [
  { name: "Provider Applications", path: "providers" },
  { name: "Users", path: "users" },
  { name: "Products", path: "products" },
  { name: "Orders", path: "orders" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col">
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `p-4 ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-50"}`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
