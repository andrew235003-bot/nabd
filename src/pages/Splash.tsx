import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { NabdLogo } from "@/components/NabdLogo";

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/welcome"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <PhoneFrame>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <NabdLogo size={140} />
        <h1 className="text-4xl font-semibold brand-gradient-text tracking-tight">نبض</h1>
      </div>
    </PhoneFrame>
  );
};

export default Splash;
