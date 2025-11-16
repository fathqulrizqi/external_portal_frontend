import { useState, useEffect } from "react";

import imgImage1 from "../../assets/Landing/Image1.png";
import imgImage2 from "../../assets/Landing/Image2.png";
import imgImage3 from "../../assets/Landing/Image3.png";
import imgImage4 from "../../assets/Landing/Image4.png";

export function useActiveBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return { width };
}
function TextDesktop() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[36px] text-black tracking-[-0.72px] w-full">
        <h2 className="block leading-[1.2]">A really compelling headline</h2>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[20px] text-[rgba(0,0,0,0.55)] tracking-[-0.1px] w-full">
        <p className="leading-[1.45]">Call out a feature, benefit, or value of your site, then link to a page where people can learn more about it.</p>
      </div>
    </div>
  );
}

function ButtonDesktop() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-nowrap text-white tracking-[-0.09px]">
        <p className="leading-[1.45] whitespace-pre">Call to action</p>
      </div>
    </div>
  );
}

function ContentDesktop() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[40px] items-start pb-[80px] pt-0 px-0 relative shrink-0 w-full" data-name="Content">
      <TextDesktop />
      <ButtonDesktop />
    </div>
  );
}

function Column1Desktop() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Column 1">
      <div className="h-[390px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage1} />
      </div>
      <div className="h-[390px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Column2Desktop() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px pb-0 pt-[96px] px-0 relative shrink-0" data-name="Column 2">
      <div className="h-[390px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage3} />
      </div>
      <div className="h-[390px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function ImageGalleryDesktop() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-name="Image gallery">
      <Column1Desktop />
      <Column2Desktop />
    </div>
  );
}

function ImageAndTextDesktop() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Image and text">
      <ContentDesktop />
      <ImageGalleryDesktop />
    </div>
  );
}

function FeatureGalleryDesktop() {
  return (
    <section className="relative size-full" data-name="Feature gallery">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start px-[120px] py-[80px] relative size-full">
          <ImageAndTextDesktop />
        </div>
      </div>
    </section>
  );
}

function TextTablet() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[32px] text-black tracking-[-0.64px] w-full">
        <h2 className="block leading-[1.2]">A really compelling headline</h2>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[18px] text-[rgba(0,0,0,0.55)] tracking-[-0.09px] w-full">
        <p className="leading-[1.45]">Call out a feature, benefit, or value of your site, then link to a page where people can learn more about it.</p>
      </div>
    </div>
  );
}

function ButtonTablet() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-nowrap text-white tracking-[-0.09px]">
        <p className="leading-[1.45] whitespace-pre">Call to action</p>
      </div>
    </div>
  );
}

function ContentTablet() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-[64px] pt-0 px-0 relative shrink-0 w-full" data-name="Content">
      <TextTablet />
      <ButtonTablet />
    </div>
  );
}

function Column1Tablet() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Column 1">
      <div className="h-[293px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage1} />
      </div>
      <div className="h-[295px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Column2Tablet() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-start min-h-px min-w-px pb-0 pt-[96px] px-0 relative shrink-0" data-name="Column 2">
      <div className="h-[293px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage3} />
      </div>
      <div className="h-[295px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function ImageGalleryTablet() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full" data-name="Image gallery">
      <Column1Tablet />
      <Column2Tablet />
    </div>
  );
}

function ImageAndTextTablet() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Image and text">
      <ContentTablet />
      <ImageGalleryTablet />
    </div>
  );
}

function FeatureGalleryTablet() {
  return (
    <section className="relative size-full" data-name="Feature gallery">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[64px] relative size-full">
          <ImageAndTextTablet />
        </div>
      </div>
    </section>
  );
}

function TextMobile() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[28px] text-black tracking-[-0.56px] w-full">
        <h2 className="block leading-[1.2]">A really compelling headline</h2>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[16px] text-[rgba(0,0,0,0.55)] tracking-[-0.08px] w-full">
        <p className="leading-[1.45]">Call out a feature, benefit, or value of your site, then link to a page where people can learn more about it.</p>
      </div>
    </div>
  );
}

function ButtonMobile() {
  return (
    <div className="bg-black relative rounded-[12px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative w-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.08px]">
            <p className="leading-[1.45] whitespace-pre">Call to action</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentMobile() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-[48px] pt-0 px-0 relative shrink-0 w-full" data-name="Content">
      <TextMobile />
      <ButtonMobile />
    </div>
  );
}

function Column1Mobile() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Column 1">
      <div className="h-[265px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage1} />
      </div>
      <div className="h-[265px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Column2Mobile() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Column 2">
      <div className="h-[265px] relative rounded-[16px] shrink-0 w-full" data-name="Image 1">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage3} />
      </div>
      <div className="h-[265px] relative rounded-[16px] shrink-0 w-full" data-name="Image 2">
        <img alt="Gallery image" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[16px] size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function ImageGalleryMobile() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Image gallery">
      <Column1Mobile />
      <Column2Mobile />
    </div>
  );
}

function ImageAndTextMobile() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Image and text">
      <ContentMobile />
      <ImageGalleryMobile />
    </div>
  );
}

function FeatureGalleryMobile() {
  return (
    <section className="relative size-full" data-name="Feature gallery">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[40px] pt-[64px] px-[24px] relative size-full">
          <ImageAndTextMobile />
        </div>
      </div>
    </section>
  );
}

function FeatureGallery() {
  const { width } = useActiveBreakpoint();
  if (width < 800) {
    return <FeatureGalleryMobile />;
  }
  if (width < 1280) {
    return <FeatureGalleryTablet />;
  }
  return <FeatureGalleryDesktop />;
}

export default FeatureGallery;