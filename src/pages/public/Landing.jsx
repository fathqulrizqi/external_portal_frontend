import { Link } from "react-router-dom";
import Background from "../../components/Landing/Background";
import FeatureGallery from "../../components/Landing/FeatureGallery";

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col">

      {/* Background Figma */}
      <div className="">
        {/* <Background /> */}
        <FeatureGallery />
      </div>

    
    </div>
  );
}
