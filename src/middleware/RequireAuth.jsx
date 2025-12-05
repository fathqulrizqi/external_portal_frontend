import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/cookies";
import useSidebarAuth from "../hooks/useSidebarAuth";

export default function RequireAuth() {
  const token = getToken();

  if (!token) return <Navigate to="/" replace />;

  const { loading } = useSidebarAuth(token);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  return <Outlet />;
}
