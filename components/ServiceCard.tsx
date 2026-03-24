import { formatPrice, formatDuration } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import {
  HaircutIllustration,
  HairColorIllustration,
  FacialIllustration,
  EyebrowIllustration,
  CleanupIllustration,
  GroomingIllustration,
  SpaIllustration,
  BleachIllustration,
} from "@/components/icons/ServiceIllustrations";

const getServiceIcon = (name: string) => {
  const n = name.toLowerCase();
  
  if (n.includes("cut")) return <HaircutIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("colour") || n.includes("color")) return <HairColorIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("spa")) return <SpaIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("facial")) return <FacialIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("eyebrow")) return <EyebrowIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("clean")) return <CleanupIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("grooming")) return <GroomingIllustration className="w-full h-full drop-shadow-sm" />;
  if (n.includes("bleach")) return <BleachIllustration className="w-full h-full drop-shadow-sm" />;
  
  return <SpaIllustration className="w-full h-full drop-shadow-sm" />;
};

const getServiceDescription = (name: string, originalDesc?: string | null) => {
  const n = name.toLowerCase();
  if (n.includes("cut")) return "Discover the art of personalized beauty at our studio, where expert stylists craft the perfect haircut to elevate your style with precision and flair.";
  if (n.includes("colour") || n.includes("color")) return "Immerse yourself in a world of vibrant possibilities as we transform your look with expertly crafted and personalized hair color services that reflect your unique style.";
  if (n.includes("spa")) return "Revitalize your locks with our premium hair spa. A deeply nourishing treatment designed to repair, strengthen, and restore your hair's natural, healthy shine.";
  if (n.includes("facial")) return "Indulge in our signature facial treatments, tailored to rejuvenate your skin, unclog pores, and restore a youthful, glowing complexion with premium products.";
  if (n.includes("eyebrow")) return "Frame your face perfectly with our expert eyebrow shaping and threading services, creating balanced, defined arches to enhance your natural beauty.";
  if (n.includes("clean")) return "Experience a refreshing deep face clean up. We gently exfoliate and purify your skin, removing daily impurities to leave your face feeling soft and revitalized.";
  if (n.includes("grooming")) return "Elevate your personal presentation with our comprehensive men's grooming, featuring precise beard trimming, sharp styling, and premium care outfitting you for success.";
  if (n.includes("bleach")) return "Achieve a flawless, even skin tone with our gentle face bleach service. Safely lightens facial hair and imparts an instant radiant glow to your complexion.";
  
  return originalDesc || "Experience premium salon services tailored completely to your unique style and needs.";
};

interface ServiceCardProps {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  branchId?: string;
  showBookButton?: boolean;
}

export default function ServiceCard({
  id,
  name,
  description,
  price,
  duration,
  branchId,
  showBookButton = true,
}: ServiceCardProps) {
  const displayDescription = getServiceDescription(name, description);

  return (
    <div className="group bg-white rounded-3xl border border-stone-100 p-8 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-500 flex flex-col items-center text-center h-full">
      <div className="relative mb-6 cursor-default">
        {/* Flat Vector Illustration Container */}
        <div className="w-24 h-24 mx-auto flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-105 will-change-transform z-10">
          {getServiceIcon(name)}
        </div>
        
        {/* Subtle static floor shadow perfectly mirroring the reference images */}
        <div className="w-14 h-[6px] bg-stone-300 rounded-[50%] opacity-80 mt-3 mx-auto transition-all duration-500 group-hover:opacity-40 group-hover:scale-75" />
      </div>
      
      <h3 className="font-display text-xl font-bold text-stone-800 mb-3 tracking-tight">
        {name}
      </h3>
      
      <p className="text-stone-500 text-[14px] mb-8 line-clamp-4 leading-relaxed flex-grow px-2">
        {displayDescription}
      </p>
      
      <div className="w-full mt-auto pt-6 border-t border-stone-100/80 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full bg-stone-50/80 rounded-2xl p-4 border border-stone-100/50">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Price</span>
            <span className="font-display font-bold text-xl text-primary-600 leading-none">
              {formatPrice(price)}
            </span>
          </div>
          <div className="w-px h-8 bg-stone-200/60"></div>
          <div className="flex flex-col text-right items-end">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">Duration</span>
            <span className="font-medium text-stone-700 flex items-center gap-1.5 text-sm">
              <Clock size={14} className="text-primary-400" />
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        
        {showBookButton && (
          <a
            href={branchId ? `/?branch=${branchId}&service=${id}#booking` : `/?service=${id}#booking`}
            className="w-full relative group/btn overflow-hidden rounded-xl bg-stone-900 text-white font-medium flex items-center justify-center gap-2 py-3.5 transition-all hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/20 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2 text-[15px]">
              Book Appointment
              <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1.5 text-primary-400" />
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
