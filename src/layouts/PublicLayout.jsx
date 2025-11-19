import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CoverHero from "../components/Landing/Cover";

export default function PublicLayout() {
  const location = useLocation();

  // true jika route adalah "/"
  const isLandingPage = location.pathname === "/";

  return (
    <div className="w-full flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full shadow bg-black">
        <Header />
      </header>

      {/* SHOW CoverHero only on "/" */}
      {isLandingPage && <CoverHero />}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 E-Bidding
      </footer>
    </div>
  );
}
