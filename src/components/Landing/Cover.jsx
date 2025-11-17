import imgCover from "../../assets/images/cover.png";
import { useActiveBreakpoint } from "../../hooks/useBreakpoints";

export default function CoverHero() {
  const { width } = useActiveBreakpoint();

  const isMobile = width < 800;
  const isTablet = width >= 800 && width < 1200;

 
  return (
    <div className="relative w-full h-[50vh] lg:h-[100vh] md:h-[60vh]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
       <img
  src={imgCover}
  alt=""
  className={`
    absolute inset-0 w-full h-full object-cover object-top
  `}
/>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      </div>
    </div>
  );
}
