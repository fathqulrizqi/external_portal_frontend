import React from "react";

export default function AdminExternalLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">External Admin</h1>
        <nav className="flex flex-col gap-2">
          <a href="#" className="p-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="#" className="p-2 rounded hover:bg-gray-200">Vendors</a>
          <a href="#" className="p-2 rounded hover:bg-gray-200">Tender</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}