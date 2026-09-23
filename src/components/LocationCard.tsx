import { MapPin } from "lucide-react";

interface Props {
  pinColor: string;
  pinLabel?: string;
}

// A lightweight, decorative "map" placeholder with a centered pin.
export const LocationCard = ({ pinColor, pinLabel }: Props) => (
  <div
    className="mt-5 rounded-3xl border border-border overflow-hidden relative h-56"
    style={{
      background:
        "radial-gradient(circle at 30% 30%, hsl(200 60% 92%), hsl(200 30% 86%) 45%, hsl(180 25% 80%))",
    }}
  >
    {/* Decorative roads */}
    <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 220" preserveAspectRatio="none">
      <path d="M0 120 C 100 60, 220 180, 400 90" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M0 60 L 400 200" stroke="white" strokeOpacity="0.6" strokeWidth="6" fill="none" />
      <path d="M120 0 L 200 220" stroke="white" strokeOpacity="0.5" strokeWidth="5" fill="none" />
    </svg>

    {/* Pin */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl animate-float-in"
        style={{ background: pinColor, boxShadow: `0 10px 24px -6px ${pinColor}` }}
      >
        <MapPin size={22} />
      </div>
      <div
        className="w-3 h-3 rotate-45 -mt-1.5"
        style={{ background: pinColor }}
      />
      {pinLabel && (
        <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-foreground shadow">
          {pinLabel}
        </span>
      )}
    </div>
  </div>
);
