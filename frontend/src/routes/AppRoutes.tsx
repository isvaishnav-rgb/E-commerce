import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import LandingPage from "../pages/landingPage/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OtpVerification from "../pages/auth/OtpVerification";
import MyOrdersPage from "../pages/order/MyOrdersPlace";

// Service provider
import ServiceProviderForm from "../pages/serviceProvider/ServiceProviderForm";
import ServiceProviderDashboard from "../pages/serviceProvider/ServiceProviderDashboard";

// User pages
// import Cart from "../pages/cart/Cart";
// import Wishlist from "../pages/wishlist/Wishlist";
// import Profile from "../pages/profile/Profile";

// // Admin pages
// import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import ProviderApplications from "../pages/admin/ProviderApplications";
import Products from "../pages/admin/Products";
import Users from "../pages/admin/Users";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import ChangePassword from "../pages/auth/ChangePassword";
import UpdateProfile from "../pages/auth/UpdateProfile";
import Profile from "../pages/auth/Profile";
import ServiceProviderPage from "../pages/serviceProvider/ServiceProviderPage";
import CheckoutPage from "../pages/product/CartProduct";
import WishlistPage from "../pages/product/WishlistPage";
import PaymentPage from "../pages/payment/Payment";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<OtpVerification />} />

      {/* ================= USER ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} /> */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/become-provider" element={<ServiceProviderForm />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/provider" element={<ServiceProviderPage />} />
        <Route path="/cart" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
      </Route>

      {/* ================= PROVIDER ROUTES ================= */}
      <Route
        element={<RoleRoute allowedRoles={["provider"]} />}
      >
        <Route
          path="/service-provider/dashboard"
          element={<ServiceProviderDashboard />}
        />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="providers" element={<ProviderApplications />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;