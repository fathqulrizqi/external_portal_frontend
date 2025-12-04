import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminExternalLayout from "../layouts/DashboardLayout";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/login/Login";
import LoginOtp from "../pages/public/login/LoginOtp";
import Register from "../pages/public/register/Register";
import RegisterOtp from "../pages/public/register/RegisterOtp";

import DashboardInternal from "../pages/admin/internal/DashboardInternal";
import DashboardExternal from "../pages/admin/external/DashboardExternal";

import RequireAuth from "../middleware/RequireAuth";
import GuestOnly from "../middleware/GuestOnly";
import Header from "../components/Header";
import ExternalLayout from "../layouts/ExternalLayout";
import DashboardLayout from "../layouts/DashboardLayout";

const router = createBrowserRouter([
  // PUBLIC
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },

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
      { index: "/dashboard", element: <DashboardLayout /> },
    ],
  },

]);

export default router;
