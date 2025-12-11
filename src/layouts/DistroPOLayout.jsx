import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

export default function DistroPOLayout() {
  const location = useLocation();

  return (
    <div className="w-full flex flex-col bg-gray-50">
      <header className="w-full shadow bg-black">
        <Header
        menus={[
            { label: "About Distro PO", to: "/distro-po/about" },
        ]}
        showAuth={true}
        authBasePath="/distro-po"
        />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 Distro PO Portal
      </footer>
    </div>
  );
}
