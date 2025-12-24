import imgCover from "../assets/images/cover-register.png";
import HeaderExternal from "../components/HeaderExternal";
import { useActiveBreakpoint } from "../hooks/useBreakpoints";
import { useEffect, useState } from "react";
import { getSidebar } from "../api/sidebar";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  return (
    <div className="bg-neutral-100 w-full max-w-[280px] md:max-w-[612px] lg:max-w-[700px] p-3 flex items-center gap-2 rounded">
      <svg className="w-6 h-6" viewBox="0 0 18 18" fill="#313030">
        <path d="" />
      </svg>

      <input
        type="text"
        placeholder="Search Here"
        className="text-[#313030] placeholder-[#cfcfcf] text-base font-almarai font-bold bg-transparent outline-none w-full"
      />
    </div>
  );
}



function WelcomeLayout({ children }) {
  return (
    <div className="relative w-full h-full">
      <img
        src={imgCover}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      <div className="flex font-almarai items-center justify-center w-full h-full relative z-10">
        <div className="flex flex-col items-center gap-6 p-24 md:px-32 lg:px-32">
          {children}
        </div>
      </div>
    </div>
  );
}

const apps = [
  { name: "E-Bidding", color: "#d9d9d9" },
  { name: "PO", color: "#5e5757" },
  { name: "ETC", color: "#689675" },
  { name: "ETC", color: "#918c6f" },
];

function AppsSection({ sidebar }) {
  console.log("Sidebar received in AppsSection:", sidebar);
  const navigate = useNavigate();
  if (!Array.isArray(sidebar) || sidebar.length === 0) {
    return (
      <div className="w-full mx-24 px-4 md:px-24 py-6">
        <p className="text-gray-500 text-center">No menu available.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-24 px-4 md:px-24 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-[#f9b000] h-[22px] w-px shrink-0" />
        <p className="text-[#535353] font-bold text-lg md:text-2xl">Apps</p>
      </div>

      <div className="flex flex-wrap gap-8">
        {sidebar.map((menu, i) => (
          <button
            key={i}
            onClick={() => navigate(menu.redirect)}
            className="flex flex-col items-center gap-2 focus:outline-none"
          >
            <div
              className="rounded flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#d9d9d9",
              }}
            />

            <p className="font-bold text-black text-xs md:text-base">
              {menu.menuName}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}



function ExternalLayout() {
  const { width } = useActiveBreakpoint();
   
  const titleSize =
    width < 800 ? "text-[20px]" : width < 1280 ? "text-[30px]" : "text-[45px]";

  return (
    <>
      <HeaderExternal />

      <WelcomeLayout>
        <p
          className={`font-bold font-almarai text-black text-center ${titleSize}`}
        >
          Welcome to{" "}
          <span className="text-[#f9b000]">Niterra External Portal</span>
        </p>

        <div className="w-full max-w-[280px] md:max-w-[612px] lg:max-w-[700px]">
          <SearchBar />
        </div>
      </WelcomeLayout>
      <AppsSection sidebar={sidebarData} />
      <footer className="text-center text-sm text-gray-500 p-4">
        © 2025 E-Bidding
      </footer>
    </>
  );
}

export default ExternalLayout;
