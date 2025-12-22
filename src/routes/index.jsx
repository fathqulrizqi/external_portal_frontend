import { createBrowserRouter  } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/auth/Login";
import LoginOtp from "../pages/public/auth/LoginOtp";
import Register from "../pages/public/auth/Register";
import RegisterOtp from "../pages/public/auth/RegisterOtp";
import RequireAuth from "../middleware/RequireAuth";
import GuestOnly from "../middleware/GuestOnly";
import ExternalLayout from "../layouts/ExternalLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ResetPassword from "../pages/public/auth/ResetPassword";
import ResetPasswordConfirmation from "../pages/public/auth/ResetPasswordConfirmation";
import DistroPoRoutes from "./distro-po/distro-po-routes";
import DistroPoDashboardRoutes from "./distro-po/distro-po-dashboard-routes";
import CompanyProfilePage from '../pages/company/CompanyProfile';

// Other routes Start
//import DistroPoRoutes from "./distro-po";

// Other routes End
const router = createBrowserRouter([

  // PUBLIC (landing general)
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "new-password", element: <ResetPasswordConfirmation /> },

      { path: "login", element: <GuestOnly><Login /></GuestOnly> },
      { path: "login/otp", element: <GuestOnly><LoginOtp /></GuestOnly> },

      { path: "register", element: <GuestOnly><Register /></GuestOnly> },
      { path: "register/otp", element: <GuestOnly><RegisterOtp /></GuestOnly> },
    ],
  },

  // EXTERNAL PORTAL
  {
    path: "/external-portal",
    element: (
      <RequireAuth>
        <ExternalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <ExternalLayout /> },
      { path: ":menu", element: <DashboardLayout /> },
    ],
  },

  // INTERNAL DASHBOARD
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardLayout /> },
      { path: ":menu", element: <DashboardLayout /> },
    ],
  },

  // COMPANY PROFILE
  {
    path: "/company/profile",
    element: <CompanyProfilePage />,
  },

  // DISTRO PO (berdiri sendiri)
  ...DistroPoRoutes,
  ...DistroPoDashboardRoutes,
]);

export default router;
