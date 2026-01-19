import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  Lock,
  LogOut,
  Heart
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { getMyServiceProviderApplicationApi } from "../api/serviceProvider.api";
import { setApplication } from "../features/provider/providerSlice";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement | null | any>(null);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const { products } = useAppSelector(state => state.products)

  useEffect(() => {
    // unique categories
    console.log(products)
    const uniqueCategories = Array.from(
      new Set(products.map((item: any) => item.category))
    );

    setCategoryOptions(uniqueCategories);
  }, [products]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilter]);


  const applySearchAndFilter = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    navigate(`/?${params.toString()}`);
  };

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const menuRef = useRef<HTMLDivElement | null>(null);

  const application = useSelector(
    (state: any) => state.provider.application
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  /* Fetch provider application */
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await getMyServiceProviderApplicationApi();
        dispatch(setApplication(res.data.application || null));
      } catch {
        dispatch(setApplication(null));
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [dispatch]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-600"
          >
            Apna<span className="text-gray-900">Mart</span>
          </Link>

          {/* Search */}
          <div className="hidden md:block w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  navigate(`/?search=${search}`);
                }
              }}
              className="w-full rounded-full border bg-white px-5 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="hidden md:flex items-center gap-2 px-4 py-2 border rounded-full text-sm hover:bg-gray-100"
          >
            Filters
            <ChevronDown size={16} />
          </button>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {user?.role !== "admin" && (
              <Link
                to="/wishlist"
                className={`relative p-2 rounded-full transition
                ${location.pathname === "/wishlist"
                    ? "bg-red-100"
                    : "hover:bg-gray-100"
                  }`}
              >
                <Heart
                  className={
                    user?.wishlist?.length
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }
                />
              </Link>
            )}

            {/* Cart */}
            {user?.role !=="admin" && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition
                ${location.pathname === "/cart"
                    ? "bg-indigo-100"
                    : "hover:bg-gray-100"
                  }`}
              >
                <ShoppingCart className="text-gray-700" />
                {user?.cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {user.cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {!isAuthenticated ? (
              <div className="hidden md:flex gap-3">
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition
                   ${isLoginPage
                      ? "bg-indigo-600 text-white hover:opacity-90"
                      : "border border-indigo-600 text-indigo-600"
                    }
                 `}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className={`px-5 py-2 rounded-full text-sm font-medium transition
                    ${isSignupPage
                      ? "bg-indigo-600 text-white hover:opacity-90"
                      : "border border-indigo-600 text-indigo-600"
                    }
                   `}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Avatar Button */}
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 hover:bg-gray-200 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                    {firstLetter}
                  </div>
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <User size={16} /> Profile
                    </NavLink>

                    <NavLink
                      to="/update-profile"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <User size={16} /> Update Profile
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Lock size={16} /> Change Password
                    </NavLink>

                    {user.role !== "admin" && <NavLink
                      to="/orders"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Orders
                    </NavLink>
                    }

                    {user.role !== "admin" && !application && (
                      <NavLink
                        to="/become-provider"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Apply for Service Provider
                      </NavLink>
                    )}

                    {user.role != "admin" && application && (
                      <NavLink
                        to="/provider"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Service Provider Status
                      </NavLink>
                    )}

                    {application?.status === "Approved" && user.role !== "admin" && (
                      <NavLink
                        to="/service-provider/dashboard"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Service Provider DashBoard
                      </NavLink>
                    )}

                    {user.role === "admin" && <NavLink
                      to="/admin"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </NavLink>}

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center rounded-lg py-2 bg-indigo-600 text-white"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-center rounded-lg py-2 border border-indigo-600 text-indigo-600"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Profile
              </NavLink>

              <NavLink
                to="/update-profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Update Profile
              </NavLink>

              <NavLink
                to="/change-password"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Change Password
              </NavLink>

              {user?.role === "user" && !application && (
                <NavLink
                  to="/become-provider"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Apply for Service Provider
                </NavLink>
              )}

              {application && (
                <NavLink
                  to="/provider"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Service Provider Status
                </NavLink>
              )}

              {application.status === "Approved" && (
                <NavLink
                  to="/service-provider/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  Service Provider Dashboard
                </NavLink>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
      {showFilter && (
        <div
          ref={filterRef}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[600px] bg-white border rounded-2xl shadow-xl p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              >
                <option value="">All</option>
                {categoryOptions.map((item) => <option key="id" value={item}>{item}</option>)}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="₹0"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
                placeholder="₹50000"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => {
                setCategory("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
            >
              Clear
            </button>

            <button
              onClick={() => {
                applySearchAndFilter();
                setShowFilter(false);
              }}
              className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:opacity-90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
