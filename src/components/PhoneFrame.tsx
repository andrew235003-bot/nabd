import { ReactNode } from "react";

export const PhoneFrame = ({ children, variant }: { children: ReactNode; variant?: "muted" }) => (
  <div
    className={`phone-frame animate-float-in ${variant === "muted" ? "phone-frame--muted" : ""}`}
  >
    {children}
  </div>
);
