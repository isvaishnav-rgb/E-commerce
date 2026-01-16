import { Routes, Route } from "react-router-dom"
import LandingPage from "../pages/landingPage/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ServiceProviderForm from "../pages/serviceProvider/ServiceProviderForm";
import OtpVerification from "../pages/auth/OtpVerification";
import ServiceProviderDashboard from "../pages/serviceProvider/ServiceProviderDashboard";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify" element={<OtpVerification />} />
                <Route path="/become-provider" element={<ServiceProviderForm />} />
                <Route
                    path="/service-provider/dashboard"
                    element={<ServiceProviderDashboard />}
                />
            </Routes>
        </>
    )
}

export default AppRoutes;