import { NavLink } from "react-router-dom";

const links = [
  { name: "Provider Applications", path: "providers" },
  { name: "Users", path: "users" },
  { name: "Products", path: "products" },
  { name: "Orders", path: "orders" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r">
      <h2 className="p-4 text-xl font-bold">Admin Panel</h2>

      <nav className="flex flex-col">
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            className={({ isActive }) =>
              `p-4 ${isActive ? "bg-gray-200 font-semibold" : ""}`
            }
          >
            {l.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
