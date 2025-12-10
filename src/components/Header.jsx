import { useState, useEffect } from "react";
import imgLogoNiterra from "../assets/images/Logo-Niterra-01.png";
import { Link } from "react-router-dom";
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
   COMPONENTS
--------------------------------------------------- */
function Logo({ width, height }) {
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
function RegisterButton() {
  return (
    <a
      href="/register"
      className="bg-[#00727d] px-[8px] py-[4px] flex items-center justify-center shrink-0"
    >
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-white">
        Register
      </p>
    </a>
  );
}

function LoginButton() {
  return (
    <a
      href="/login"
      className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black"
    >
        Login
    </a>
  );
}

function NavLinks({ showFullMenu }) {
  if (!showFullMenu) return null;

  return (
    <div className="flex items-center gap-[19px]">
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black">
        E-Bidding
      </p>
      <Link to="/distro-po" className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black">
              Distro PO
      </Link>
      <Divider />
     
      <LoginButton />
      <RegisterButton />
    </div>
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
     
      <LoginButton />
      <RegisterButton />
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
          {showFullMenu ? <NavLinks showFullMenu={true} /> : <MobileMenuIcon />}
        </div>
      </div>
    </nav>
  );
}

export default function Header() {
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
