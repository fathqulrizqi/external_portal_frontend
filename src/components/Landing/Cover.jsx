import imgHero from "../../assets/images/Landing/vector-bidding.png";
import { useActiveBreakpoint } from "../../hooks/useBreakpoints";


/* ---------------------------------------------------
   DESKTOP
--------------------------------------------------- */
function HeroDesktop() {
  return (
    <div className="bg-white w-full flex justify-between items-center py-[96px] px-[96px] gap-[96px]">
      <p className="font-almarai font-bold text-[45px] leading-tight text-black max-w-[700px]">
        Lorem Ipsum is simply dummy text of the printing and{" "}
        <span className="text-[#f9b000]">typesetting industry</span>
      </p>

      <div className="w-[300px] h-[272px] relative">
        <img src={imgHero} className="absolute inset-0 w-full h-[110%] object-cover" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   TABLET
--------------------------------------------------- */
function HeroTablet() {
  return (
    <div className="bg-white w-full flex justify-between items-center py-[96px] px-[48px] gap-[48px]">
      <p className="font-almarai font-bold text-[30px] leading-snug text-black max-w-[500px]">
        Lorem Ipsum is simply dummy text of the printing and{" "}
        <span className="text-[#f9b000]">typesetting industry</span>
      </p>

      <div className="w-[215px] h-[194px] relative">
        <img src={imgHero} className="absolute inset-0 w-full h-[110%] object-cover" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   MOBILE
--------------------------------------------------- */
function HeroMobile() {
  return (
    <div className="bg-white w-full flex flex-col items-center py-[40px] px-[24px] gap-[24px]">
      <div className="w-[215px] h-[194px] relative">
        <img src={imgHero} className="absolute inset-0 w-full h-[110%] object-cover" />
      </div>

      <p className="font-almarai font-bold text-[20px] leading-snug text-black text-center max-w-[320px]">
        Lorem Ipsum is simply dummy text of the printing and{" "}
        <span className="text-[#f9b000]">typesetting industry</span>
      </p>
    </div>
  );
}

/* ---------------------------------------------------
   MAIN WRAPPER
--------------------------------------------------- */
export default function CoverHero() {
  const { width } = useActiveBreakpoint();

  if (width < 800) return <HeroMobile />;
  if (width < 1280) return <HeroTablet />;
  return <HeroDesktop />;
}
