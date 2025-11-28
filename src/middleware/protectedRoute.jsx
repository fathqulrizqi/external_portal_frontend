import { Outlet } from "react-router-dom";
import useSidebarAuth from "../hooks/useSidebarAuth";

export default function ProtectedRoute() {
  const { sidebar, loading } = useSidebarAuth();

  if (loading) return <div>Loading...</div>;

  if (!sidebar) return null;

  return <Outlet />;
}
