import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminInternalLayout from "../layouts/AdminInternalLayout";
import AdminExternalLayout from "../layouts/AdminExternalLayout";

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

  // ADMIN INTERNAL
  {
    path: "/admin/internal",
    element: (
      <RequireAuth>
        <AdminInternalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardInternal /> },
    ],
  },

  // ADMIN EXTERNAL / vendor
  {
    path: "/admin/external",
    element: (
      <RequireAuth>
        <AdminExternalLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardExternal /> },
    ],
  },
]);

export default router;
