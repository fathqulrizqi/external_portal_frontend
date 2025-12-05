import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgLogoNiterra from "../assets/images/Logo-Niterra-01.png";
import Swal from "sweetalert2";
import { useActiveBreakpoint } from "../hooks/useBreakpoints";
import { removeToken } from "../utils/cookies";

/* ---------------------------------------------------
   COMPONENTS
--------------------------------------------------- */
function Logo({ width, height }) {
  return (
    <Link to="/external-portal" className="block">
      <div style={{ width, height }} className="relative shrink-0 cursor-pointer">
        <img
          src={imgLogoNiterra}
          alt="Niterra Logo"
          className="absolute inset-0 object-cover size-full pointer-events-none"
        />
      </div>
    </Link>
  );
}

function Divider() {
  return <div className="bg-[#f9b000] h-[22px] w-px shrink-0" />;
}

function LogoutButton() {
  const navigate = useNavigate();

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

      navigate("/", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#00727d] px-[8px] py-[4px] flex items-center justify-center shrink-0"
    >
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-white">
        Logout
      </p>
    </button>
  );
}

function NavLinksExternal ({ showFullMenu }) {
  if (!showFullMenu) return null;

  return (
    <div className="flex items-center gap-[19px]">
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black">
        Need Help?
      </p>
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black">
        QnA
      </p>
      <Divider />
     
      <LogoutButton />
    </div>
  );
}

function MobileMenuIcon() {
  return (
    <div className="text-black text-[24px] cursor-pointer">
      <i className="fa-solid fa-bars"></i>
    </div>
  );
}

function NavbarLayout({ logoSize, showFullMenu }) {
  return (
    <nav className="bg-white w-full">
      <div className="flex items-center px-[48px] py-[16px] w-full">
        <Logo width={logoSize.w} height={logoSize.h} />

        <div className="flex grow justify-end">
          {showFullMenu ? <NavLinksExternal showFullMenu={true} /> : <MobileMenuIcon />}
        </div>
      </div>
    </nav>
  );
}

export default function HeaderExternal() {
  const { width } = useActiveBreakpoint();

  // MOBILE MODE
  if (width < 800) {
    return (
      <NavbarLayout
        logoSize={{ w: 140, h: 60 }}
        showFullMenu={false}  
      />
    );
  }

  // DESKTOP MODE
  return (
    <NavbarLayout
      logoSize={{ w: 200, h: 80 }}
      showFullMenu={true}
    />
  );
}
