import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminInternalLayout from "../layouts/AdminInternalLayout";
import AdminExternalLayout from "../layouts/AdminExternalLayout";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/login/Login";
import LoginOtp from "../pages/public/login/LoginOtp";
import RegisterOtp from "../pages/public/register/RegisterOtp";
import Register from "../pages/public/register/Register";

import DashboardInternal from "../pages/admin/internal/DashboardInternal";
import DashboardExternal from "../pages/admin/external/DashboardExternal";

import ProtectedRoute from "../middleware/protectedRoute";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },

      // LOGIN
      { path: "login", element: <Login /> },
      { path: "login/otp", element: <LoginOtp /> },       

      // REGISTER
      { path: "register", element: <Register /> },
      { path: "register/otp", element: <RegisterOtp /> }, 
    ],
  },


  // ADMIN INTERNAL
  {
    path: "/admin/internal",
    element: <ProtectedRoute />,        
    children: [
      {
        element: <AdminInternalLayout />, 
        children: [
          { index: true, element: <DashboardInternal /> },
        ],
      },
    ],
  },

  // ADMIN EXTERNAL (vendor)
  {
    path: "/admin/external",
    element: <ProtectedRoute />,        
    children: [
      {
        element: <AdminExternalLayout />, 
        children: [
          { index: true, element: <DashboardExternal /> },
        ],
      },
    ],
  },
]);

export default router;
