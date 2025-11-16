import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="w-full flex flex-col bg-gray-50">
       {/* NAVBAR */}
      <header className="w-full py-4 shadow bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">E-Bidding</h1>

          <nav className="space-x-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 E-Bidding
      </footer>
    </div>
  );
}
