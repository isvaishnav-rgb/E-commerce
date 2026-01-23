import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import LandingPage from "../pages/landingPage/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OtpVerification from "../pages/auth/OtpVerification";

// Service provider
import ServiceProviderForm from "../pages/serviceProvider/ServiceProviderForm";
import ServiceProviderDashboard from "../pages/serviceProvider/ServiceProviderDashboard";
import MyOrdersPage from "../pages/order/MyOrdersPlace";

// // Admin pages
import AdminLayout from "../pages/admin/AdminLayout";
import ProviderApplications from "../pages/admin/ProviderApplications";
import Products from "../pages/admin/Products";
import Users from "../pages/admin/Users";
import Orders from "../pages/admin/Orders";

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
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProductDetailsPage from "../pages/landingPage/ProductDetails";

//Miscellanous Pages
import AboutUs from "../pages/miscellaneousPages/AboutUs";
import ContactUs from "../pages/miscellaneousPages/ContactUs";
import FAQs from "../pages/miscellaneousPages/FAQS";
import Returns from "../pages/miscellaneousPages/Returns";
import PrivacyPolicy from "../pages/miscellaneousPages/PrivacyPolicy";
import TermsAndConditions from "../pages/miscellaneousPages/TermsAndCondition";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/:productId" element={<ProductDetailsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Miscellanous Pages */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />

      {/* ================= USER ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProviderApplications />} />
          <Route path="providers" element={<ProviderApplications />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;