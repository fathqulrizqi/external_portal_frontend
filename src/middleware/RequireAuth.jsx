import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useSidebarAuth from "../hooks/useSidebarAuth";

export default function RequireAuth({ children }) {
  const { sidebar, loading, errorCode, errorMessage } = useSidebarAuth();
  const location = useLocation();
  const appName = location.pathname.split("/")[1] || "public";

  if (loading) return <p>Loading...</p>;

  // Cek jika session expired (tambahkan pengecekan string manual)
  const isSessionExpired = errorMessage === "Session Expired!!" || errorCode === 401;
  const isNotActive = errorMessage === "Account is not active" || errorCode === 402;

  if (isSessionExpired) {
    return <Navigate to={`/${appName}/login-otp`} replace />;
  }

  // Jika dashboard public, bagian ini bisa dikomentari/dihapus
  // supaya user yang "not active" tetap bisa melihat children (dashboard)
  /*
  if (isNotActive) {
    return <Navigate to={`/${appName}/register-otp`} replace />;
  }
  */

  return children;
}