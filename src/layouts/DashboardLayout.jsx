import React, { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { removeToken } from "../utils/cookies";
import image from "../assets/images/distro-po-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBoxesStacked,
  faTrophy,
  faList,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  // HELPER
  const navClass = ({ isActive }) =>
    `
  group flex items-center px-3 py-3 rounded-lg
  transition-all duration-200 ease-out
  hover:bg-green-50 hover:text-green-600 hover:translate-x-1
  ${isActive ? "bg-green-50 text-green-600" : "text-gray-700"}
  `;

  const svgClass = ({ isActive }) =>
    `
  w-5 h-5 mr-3
  ${isActive ? "text-yellow-600" : "text-gray-400"}
  group-hover:text-yellow-600
  `;

  // DUMMY
  const menus = [
    {
      to: "/distro-po/dashboard",
      label: "Dashboard",
      exact: true,
      icon: faHouse,
    },
    {
      to: "/distro-po/dashboard/masteritem",
      label: "Master Item",
      icon: faBoxesStacked,
    },
    {
      to: "/distro-po/dashboard/masterachivement",
      label: "Master Achievement",
      icon: faTrophy,
    },
    {
      to: "/distro-po/dashboard/list",
      label: "Distro PO List",
      icon: faList,
    },
    {
      to: "/distro-po/dashboard/summary",
      label: "Summary",
      icon: faChartSimple,
    },
  ];

  const profile = {
    name: "Ariana Grande",
    email: "ariana.grande@mail.com",
  };

  const userInitial = profile.name?.charAt(0).toUpperCase();

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg p-4
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static
        `}
        style={{ display: sidebarOpen ? "block" : "none" }}
      >
        <div className="flex justify-between items-center mb-6">
          <img src={image} alt="Distro PO" className="h-12 w-auto" />

          <button
            className="md:inline px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-label="Hide sidebar"
          >
            ×
          </button>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              end={menu.exact}
              className={navClass}
            >
              {({ isActive }) => (
                <>
                  <FontAwesomeIcon
                    icon={menu.icon}
                    className={`mr-3 ${
                      isActive ? "text-yellow-600" : "text-gray-400"
                    }`}
                  />
                  {menu.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 flex flex-col h-full overflow-hidden ${
          sidebarOpen ? "md:ml-0" : "w-full"
        }`}
      >
        {/* NAVBAR */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Menu toggle + Search */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Menu toggle button */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
                aria-label="Show sidebar"
                style={{ display: sidebarOpen ? "none" : "flex" }}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Search bar */}
              <form
                onSubmit={handleSearch}
                className="relative flex-1 max-w-md"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Search ..."
                  />
                </div>
              </form>
            </div>

            {/* Right: Profile & Settings */}
            <div className="flex items-center space-x-3">
              {/* Settings button */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                title="Settings"
              >
                <svg
                  className="w-6 h-6 text-gray-600 group-hover:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative z-50">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userInitial}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {profile.name}
                      </p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                    <Link
                      to="profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-white p-6 rounded-2xl shadow-sm h-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
