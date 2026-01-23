import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { getMyServiceProviderApplicationApi } from "../api/serviceProvider.api";
import { setApplication } from "../features/provider/providerSlice";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductFilter from "../components/ProductFilter";
import Logo from "../components/Logo";
import CustomizedInputBase from "../components/SearchInput";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

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
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");

    navigate("/", { replace: true });
    setShowFilter(false);
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search"); // ✅ important for empty search
      }

      params.delete("page"); // optional but recommended (reset pagination)

      navigate(`/?${params.toString()}`, { replace: true });
      setIsOpen(false)
    }, 500); // debounce delay

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const menuRef = useRef<HTMLDivElement | null>(null);

  const application = useSelector(
    (state: any) => state.provider.application
  );

  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state?.auth);

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  /* Fetch provider application */
  useEffect(() => {
    if (!user?._id) {
      dispatch(setApplication(null));
      setLoading(false);
      return;
    }

    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await getMyServiceProviderApplicationApi();
        dispatch(setApplication(res.data.application || null));
      } catch {
        dispatch(setApplication(null));
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user?._id, dispatch]);


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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-300 shadow-sm py-1">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Logo text="text-2xl" />

          {/* Search */}
          <div className="hidden md:block w-96">
            <CustomizedInputBase
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="hidden md:block">
            <Button
              variant="outlined"
              onClick={() => setShowFilter((prev) => !prev)}
              sx={{
                borderRadius: "9999px",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                  borderColor: "primary.main",
                },
              }}>
              Filters {!showFilter ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </Button>
          </div>

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

                {user?.wishlist?.length ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "grey" }} />
                )}

                {user?.wishlist?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {user?.wishlist?.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            {user?.role !== "admin" && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition
                ${location.pathname === "/cart"
                    ? "bg-indigo-100"
                    : "hover:bg-gray-100"
                  }`}
              >
                <ShoppingCartIcon sx={{ color: "grey" }} />
                {user?.cart?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {user?.cart?.length}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {!isAuthenticated ? (
              <div className="hidden md:flex gap-3">
                <Button
                  component={Link}
                  to="/login"
                  variant={isLoginPage ? "contained" : "outlined"} >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/signup"
                  variant={isSignupPage ? "contained" : "outlined"} >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="relative hidden md:block">
                <div
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="flex items-center gap-2 cursor-pointer bg-gray-200 p-1 rounded-full"
                >
                  <Avatar
                    sx={{
                      bgcolor: deepOrange[500],
                      width: 36,
                      height: 36,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        bgcolor: deepOrange[600],
                      },
                    }}
                    alt="User avatar"
                    src={user?.avatar || ""}
                  >
                    {firstLetter}
                  </Avatar>

                  {!showMenu ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-56 rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-3 border-b border-gray-300">
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
                      <PersonOutlineIcon /> Profile
                    </NavLink>

                    <NavLink
                      to="/update-profile"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <PersonOutlineIcon /> Update Profile
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LockOpenIcon /> Change Password
                    </NavLink>

                    {user?.role !== "admin" && <NavLink
                      to="/orders"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <ShoppingCartIcon /> My Orders
                    </NavLink>
                    }

                    {user?.role !== "admin" && !application && (
                      <NavLink
                        to="/become-provider"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <ArrowForwardIcon /> Apply for Seller
                      </NavLink>
                    )}

                    {user?.role !== "admin" && application && (
                      <NavLink
                        to="/provider"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <CallToActionIcon /> Seller Status
                      </NavLink>
                    )}

                    {application?.status === "Approved" && user?.role !== "admin" && (
                      <NavLink
                        to="/service-provider/dashboard"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <RecentActorsIcon /> Seller DashBoard
                      </NavLink>
                    )}

                    {user?.role === "admin" && <NavLink
                      to="/admin"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <HowToRegIcon /> Admin Dashboard
                    </NavLink>}

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogoutIcon sx={{ color: "red" }} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ClearIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isOpen && (
          <div className="md:hidden border-t bg-white px-4 py-6 space-y-4 shadow-inner animate-in slide-in-from-top duration-300">
            {/* Mobile Search */}
            <div className="w-full">
              <CustomizedInputBase
                value={search}
                onChange={setSearch}
              />
            </div>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setShowFilter((prev) => !prev);
              }}
              sx={{
                borderRadius: "9999px",
                justifyContent: "space-between",
                px: 3,
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                  borderColor: "primary.main",
                },
              }}>
              Filters {!showFilter ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </Button>

            {/* Mobile Links Below */}
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  component={Link}
                  to="/login"
                  variant={isLoginPage ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/signup"
                  variant={isSignupPage ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <div
                  className="rounded-xl bg-gray-50 border border-gray-200 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {user?.name}
                    </p>
                  </div>

                  <div className="py-2">
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                    >
                      <PersonOutlineIcon fontSize="small" /> Profile
                    </NavLink>

                    <NavLink
                      to="/update-profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                    >
                      <PersonOutlineIcon fontSize="small" /> Update Profile
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                    >
                      <LockOpenIcon fontSize="small" /> Change Password
                    </NavLink>

                    {user?.role !== "admin" && (
                      <NavLink
                        to="/orders"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                      >
                        <ShoppingCartIcon fontSize="small" /> My Orders
                      </NavLink>
                    )}

                    {user?.role !== "admin" && !application && (
                      <NavLink
                        to="/become-provider"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                      >
                        <ArrowForwardIcon fontSize="small" /> Apply for Seller
                      </NavLink>
                    )}

                    {user?.role !== "admin" && application && (
                      <NavLink
                        to="/provider"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                      >
                        <CallToActionIcon fontSize="small" /> Seller Status
                      </NavLink>
                    )}

                    {application?.status === "Approved" && user?.role !== "admin" && (
                      <NavLink
                        to="/service-provider/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                      >
                        <RecentActorsIcon fontSize="small" /> Seller DashBoard
                      </NavLink>
                    )}

                    {user?.role === "admin" && (
                      <NavLink
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors"
                      >
                        <HowToRegIcon fontSize="small" /> Admin Dashboard
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100"
                    >
                      <LogoutIcon fontSize="small" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      }
      {
        showFilter && (
          <ProductFilter
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categoryOptions={categoryOptions}
            onChange={(k, v) =>
              k === "category"
                ? setCategory(v)
                : k === "minPrice"
                  ? setMinPrice(v)
                  : setMaxPrice(v)
            }
            onApply={() => {
              applySearchAndFilter();
              setShowFilter(false);
            }}
            onClear={clearFilters}
            onClose={() => setShowFilter(false)}
          />
        )
      }
    </header >
  );
};

export default Header;
