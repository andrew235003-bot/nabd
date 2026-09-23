import { ReactNode } from "react";

interface PhoneScreenProps {
  image: string;
  children?: ReactNode;
}

// Renders an uploaded screen image as a full-bleed background with optional
// absolutely-positioned hotspots layered on top.
export const PhoneScreen = ({ image, children }: PhoneScreenProps) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-background">
      <div className="relative w-full max-w-[480px] mx-auto">
        <img
          src={image}
          alt=""
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        {children}
      </div>
    </div>
  );
};

interface HotspotProps {
  to?: () => void;
  style: React.CSSProperties;
  label?: string;
}

// Transparent clickable area expressed in % so it scales with the image.
export const Hotspot = ({ to, style, label }: HotspotProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={to}
    className="absolute cursor-pointer bg-transparent border-0 p-0 m-0 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md"
    style={style}
  />
);
