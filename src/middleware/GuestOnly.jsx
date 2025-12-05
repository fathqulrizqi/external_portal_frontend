// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// export default function GuestOnly({ children }) {
//   const token = Cookies.get("token");

//   if (token) return <Navigate to="/admin/internal" replace />;

//   return children;
// }

import React from "react";

export default function GuestOnly({ children }) {
  // Hanya render halaman login/register, redirect ditangani di RequireAuth
  return children;
}
