import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminInternalLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <h2 className="text-xl font-semibold mb-6">Internal Admin</h2>
        <nav className="space-y-3">
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Users
          </a>
          <a href="#" className="block px-3 py-2 rounded-lg hover:bg-gray-200">
            Settings
          </a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Internal Dashboard</h1>
          <button className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-80">
            Logout
          </button>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}