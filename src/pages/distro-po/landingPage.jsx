
import React from 'react';
// 1. Make sure to import the Link component
import { Link } from 'react-router-dom';
import { useActiveBreakpoint } from "../../hooks/useBreakpoints";
import imgCover from "../../assets/images/cover-register.png";



function WelcomeLayout({ children }) {
  return (
    <div className="relative w-full h-full">
      <img
        src={imgCover}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      <div className="flex font-almarai items-center justify-center w-full h-full relative z-10">
        <div className="flex flex-col items-center gap-6 px-12 py-24 md:px-32 lg:px-32 lg:py-42 md:py-42">
          {children}
        </div>
      </div>
    </div>
  );
}

// This is your existing landing page component
export default function DistroPoLandingPage() {

  const { width } = useActiveBreakpoint();

  const titleSize =
    width < 800 ? "text-[20px]" :
    width < 1280 ? "text-[30px]" :
    "text-[45px]";

  return (
    <WelcomeLayout>
      <p
        className={`font-bold font-almarai text-black text-center ${titleSize}`}
      >
        Welcome to <span className="text-[#f9b000]">Distro PO Page</span>
      </p>

      <div className="w-full max-w-[280px] md:max-w-[612px] lg:max-w-[700px]">
      </div>
    </WelcomeLayout>
  );
}

