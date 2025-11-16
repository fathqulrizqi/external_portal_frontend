import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminInternalLayout from "../layouts/AdminInternalLayout";
import AdminExternalLayout from "../layouts/AdminExternalLayout";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import DashboardInternal from "../pages/admin/internal/DashboardInternal";
import DashboardExternal from "../pages/admin/external/DashboardExternal";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // ADMIN INTERNAL
  {
    path: "/admin/internal",
    element: <AdminInternalLayout />,
    children: [
      { index: true, element: <DashboardInternal /> },
    ],
  },

  // ADMIN EXTERNAL (vendor)
  {
    path: "/admin/external",
    element: <AdminExternalLayout />,
    children: [
      { index: true, element: <DashboardExternal /> },
    ],
  },
]);

export default router;
