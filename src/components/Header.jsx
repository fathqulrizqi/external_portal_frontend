import { useState, useEffect } from "react";
import imgNgkLogo1 from "../assets/images/NGK-Logo.png";

/* ---------------------------------------------------
   HOOK: BREAKPOINT
--------------------------------------------------- */
function useActiveBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return { width };
}

/* ---------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------- */
function Logo({ width = 73, height = 46 }) {
  return (
    <div style={{ width, height }} className="relative shrink-0">
      <img
        src={imgNgkLogo1}
        alt="NGK Logo"
        className="absolute inset-0 object-cover size-full pointer-events-none"
      />
    </div>
  );
}

function RegisterButton() {
  return (
    <a
      className="bg-[red] px-[8px] py-[4px] cursor-pointer flex items-center justify-center"
      href="/register-profile"
    >
      <p className="font-alumni text-white text-[12px] tracking-[1.3px]">
        Register
      </p>
    </a>
  );
}

function NavLinks({ showFullMenu = true }) {
  return (
    <div className="flex items-center gap-[19px]">
      {showFullMenu && (
        <>
          <p className="font-alumni text-white text-[12px] tracking-[1.3px]">
            E-Bidding
          </p>
          <p className="font-alumni text-white text-[12px] tracking-[1.3px]">
            Payment Order
          </p>
          <div className="bg-white w-px h-[22px]" />
        </>
      )}

      <p className="font-alumni text-white text-[12px] tracking-[1.3px]">
        Login
      </p>

      <RegisterButton />
    </div>
  );
}

/* ---------------------------------------------------
   MAIN NAVBAR LAYOUT
--------------------------------------------------- */
function NavbarLayout({ logoSize, showFullMenu }) {
  return (
    <nav className="bg-black w-full">
      <div className="flex items-center px-[48px] py-0 w-full">
        <div className="flex items-center w-full gap-4">
          <Logo width={logoSize.w} height={logoSize.h} />

          <div className="flex grow justify-end">
            <NavLinks showFullMenu={showFullMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------
   FRAME (RESPONSIVE SELECTION)
--------------------------------------------------- */
export default function Header() {
  const { width } = useActiveBreakpoint();

  if (width < 800) {
    return (
      <NavbarLayout
        logoSize={{ w: 56, h: 35 }}
        showFullMenu={false}
      />
    );
  }

  if (width < 1200) {
    return (
      <NavbarLayout
        logoSize={{ w: 73, h: 46 }}
        showFullMenu={true}
      />
    );
  }

  return (
    <NavbarLayout
      logoSize={{ w: 73, h: 46 }}
      showFullMenu={true}
    />
  );
}
