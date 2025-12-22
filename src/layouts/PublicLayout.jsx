import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CoverHero from "../components/Content/Cover";

export default function PublicLayout() {
  const location = useLocation();

  // true jika route adalah "/"
  const isLandingPage = location.pathname === "/";

  return (
    <div className="w-full flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-50 bg-black">
        <Header
          menus={[
            { label: "E-Bidding", to: "#" },
            { label: "Distro PO", to: "/distro-po" },
          ]}
          showAuth={false}
        />
      </header>

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
