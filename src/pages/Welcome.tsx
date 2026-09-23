import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { NabdLogo } from "@/components/NabdLogo";

const Welcome = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<"AR" | "EN">("AR");
  const t = lang === "AR"
    ? { tag: "مساعدك الطبي الذكي في حالات الطوارئ", login: "تسجيل الدخول", signup: "إنشاء حساب جديد" }
    : { tag: "Your smart medical assistant in emergencies", login: "Sign In", signup: "Create New Account" };

  return (
    <PhoneFrame>
      <button
        onClick={() => setLang(lang === "AR" ? "EN" : "AR")}
        className="self-start inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-primary-deep font-bold shadow-[var(--shadow-card)]"
      >
        <span>{lang === "AR" ? "EN" : "AR"}</span>
        <Globe size={18} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <NabdLogo size={120} />
        <h1 className="text-4xl font-semibold brand-gradient-text tracking-tight">نبض</h1>
        <p className="text-muted-foreground text-base font-light max-w-xs">{t.tag}</p>
      </div>

      <div className="space-y-3 pb-4">
        <button className="brand-button" onClick={() => navigate("/login")}>{t.login}</button>
        <button className="ghost-button" onClick={() => navigate("/signup")}>{t.signup}</button>
      </div>
    </PhoneFrame>
  );
};

export default Welcome;
