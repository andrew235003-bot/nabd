import heart from "@/assets/nabd-heart.png";

export const NabdLogo = ({ size = 72 }: { size?: number }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
    <span className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
    <span className="absolute inset-4 rounded-full bg-primary/10 animate-pulse-ring" />
    <img
      src={heart}
      alt="نبض"
      style={{ width: size, height: "auto" }}
      className="relative select-none"
      draggable={false}
    />
  </div>
);
