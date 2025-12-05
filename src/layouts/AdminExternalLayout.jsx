import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default function AdminExternalLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      Cookies.remove("token", { path: "/" });
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userInfo");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md p-4 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:flex-col`}
      >
        <h2 className="text-xl font-semibold mb-6">External Admin</h2>
        <nav className="space-y-3">
          <Link to="/admin/external" className="block px-3 py-2 rounded-lg hover:bg-gray-200">Dashboard</Link>
          <Link to="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">Users</Link>
          <Link to="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden px-3 py-2 bg-gray-200 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>

          <h1 className="text-2xl font-semibold">External Dashboard</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-80"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
