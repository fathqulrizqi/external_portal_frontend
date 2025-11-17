import { Outlet, Link } from "react-router-dom";
import Header from "../components/Header";
import CoverHero from "../components/Landing/Cover";
export default function PublicLayout() {
  return (
    <div className="w-full flex flex-col bg-gray-50">
       {/* NAVBAR */}
      <header className="w-full py-4 shadow bg-black">
          <Header />
      </header>
       <CoverHero />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 E-Bidding
      </footer>
    </div>
  );
}
