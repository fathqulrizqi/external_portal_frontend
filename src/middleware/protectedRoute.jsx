import { Outlet } from "react-router-dom";
import useSidebarAuth from "../hooks/useSidebarAuth";

export default function ProtectedRoute() {
  const sidebar = useSidebarAuth();

  if (sidebar === null) return <div>Loading...</div>;

  return <Outlet />;
}
