import { useState, useEffect } from "react";
import imgBackground from "../../assets/Landing/Background.png";

const imgDeviceFrame =
  "https://i.pinimg.com/736x/c5/21/81/c52181f5212108d03720d77bdc81955a.jpg";

function useActiveBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width };
}

// ======================== DESKTOP ========================

function PrimaryButtonDesktop() {
  return (
    <div className="bg-white flex gap-2 items-center justify-center px-4 py-3 rounded-xl">
      <p className="text-lg font-medium">Your main offer</p>
    </div>
  );
}

function SecondaryButtonDesktop() {
  return (
    <div className="relative flex gap-2 items-center justify-center px-4 py-3 rounded-xl">
      <div className="absolute inset-0 border-2 border-white/15 rounded-xl" />
      <p className="text-lg font-medium">Optional second</p>
    </div>
  );
}

function ButtonsDesktop() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <PrimaryButtonDesktop />
      <SecondaryButtonDesktop />
    </div>
  );
}

function TextDesktop() {
  return (
    <div className="flex flex-col gap-12 items-center w-full">
      <h1 className="text-6xl font-bold text-center text-black">
        Landing page
      </h1>
      <ButtonsDesktop />
    </div>
  );
}

function BackgroundDesktop() {
  return (
    <div className="relative w-full h-full">
      <img
        src={imgBackground}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      {/* Overlay gelap supaya teks & tombol keliatan */}
      <div className="absolute inset-0 bg-black/0"></div>

      <div className="relative flex flex-col items-center w-full h-full">
        <div className="flex flex-col gap-32 items-center py-24 px-32 w-full h-full">
          <TextDesktop />
        
        </div>
      </div>
    </div>
  );
}

// ======================== TABLET ========================

function BackgroundTablet() {
  return (
    <div className="relative w-full h-full">
      <img
        src={imgBackground}
        className="absolute inset-0 w-full h-1/2 object-cover object-top"
      />
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col gap-24 items-center py-24 px-16 w-full h-full">
          <h1 className="text-5xl font-bold text-center text-white">
            Landing page
          </h1>
          <div className="relative w-full aspect-[608/395] rounded-2xl">
          <img
              src={imgDeviceFrame}
              className="absolute inset-0 w-full h-1/2 object-cover rounded-3xl object-center"
            />
            <div className="absolute inset-0 rounded-2xl border-8 border-white shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== MOBILE ========================

function BackgroundMobile() {
  return (
    <div className="relative w-full h-full">
      <img
        src={imgBackground}
        className="absolute inset-0 w-full h-1/2 object-cover object-top"
      />
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col gap-16 items-center py-24 px-6 w-full h-full">
          <h1 className="text-4xl font-bold text-center text-white">
            Landing page
          </h1>
          <div className="relative w-full aspect-[922/599] rounded-xl">
           <img
              src={imgDeviceFrame}
              className="absolute inset-0 w-full h-1/2 object-cover rounded-3xl object-center"
            />
            <div className="absolute inset-0 rounded-xl border-8 border-white shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== MAIN ========================

export default function Background() {
  const { width } = useActiveBreakpoint();

  if (width < 800) return <BackgroundMobile />;
  if (width < 1280) return <BackgroundTablet />;
  return <BackgroundDesktop />;
}
