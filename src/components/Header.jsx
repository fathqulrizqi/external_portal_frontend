import { useState, useEffect } from "react";
import imgLogoNiterra from "../assets/images/Logo-Niterra-01.png";
import { Link } from "react-router-dom";
import { useActiveBreakpoint } from "../hooks/useBreakpoints"
/* ---------------------------------------------------
   COMPONENTS
--------------------------------------------------- */
function Logo({ width, height, }) {
  return (
    <Link to="/" className="block">
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
<RegisterButton/>
function RegisterButton({ basePath = "" }) {
  return (
    <Link
      to={`${basePath}/register`}
      className="bg-[#00727d] px-[8px] py-[4px] tracking-[1.54px] flex items-center justify-center shrink-0 text-white"
    >
      Register
    </Link>
  );
}


function LoginButton({ basePath = "" }) {
  return (
    <Link
      to={`${basePath}/login`}
      className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black"
    >
      Login
    </Link>
  );
}


function NavLinks({ menus = [], showAuth, authBasePath }) {
  return (
    <div className="flex items-center gap-[19px]">

      {menus.map((m, idx) => (
        <Link key={idx} to={m.to}
          className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black">
          {m.label}
        </Link>
      ))}

      {showAuth && (
        <>
          <Divider />
          <LoginButton basePath={authBasePath} />
          <RegisterButton basePath={authBasePath} />
        </>
      )}
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

function NavbarLayout({ logoSize, showFullMenu, menus, showAuth, authBasePath }) {
  return (
    <nav className="bg-white w-full">
      <div className="flex items-center px-[48px] py-[16px] w-full">
        <Logo width={logoSize.w} height={logoSize.h} />

        <div className="flex grow justify-end">
          {showFullMenu ? (
            <NavLinks
              menus={menus}
              showAuth={showAuth}
              authBasePath={authBasePath}
            />
          ) : (
            <MobileMenuIcon />
          )}
        </div>
      </div>
    </nav>
  );
}



export default function Header({ menus, showAuth, authBasePath }) {
  const { width } = useActiveBreakpoint();

  return (
    <NavbarLayout
      logoSize={width < 800 ? { w: 140, h: 60 } : { w: 200, h: 80 }}
      showFullMenu={width >= 800}
      menus={menus}
      showAuth={showAuth}
      authBasePath={authBasePath}
    />
  );
}

