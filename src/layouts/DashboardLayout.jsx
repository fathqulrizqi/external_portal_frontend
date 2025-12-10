import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { removeToken } from "../utils/cookies";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const segment = location.pathname.split("/")[1]; 
  const appName = segment || "public";
  const basePath = `/${appName}`;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      removeToken();
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userInfo");
      localStorage.removeItem("tempRegister");
      navigate(`${basePath}/login`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md p-4
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <h2 className="text-xl font-semibold mb-6">Distro PO</h2>

        <nav className="space-y-3">
          <Link to="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Dashboard
          </Link>
          <Link to="/distro-po/dashboard/masteritem" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Master Item
          </Link>
          <Link to="/distro-po/dashboard/list" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Distro PO List
          </Link>
          <Link to="/distro-po/dashboard/summary" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Summary
          </Link>
          <Link to="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Users
          </Link>
          <Link to="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-h-screen p-6">
        <header className="flex justify-between items-center mb-6">

          {/* Mobile menu */}
          <button
            className="md:hidden px-3 py-2 bg-gray-200 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>

          <h1 className="text-2xl font-semibold">PAGE</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-80"
          >
            Logout
          </button>
        </header>

        {/* Page */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
