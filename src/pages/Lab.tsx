import { ArrowRight, FlaskConical, MapPin, Navigation, Phone, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";

const labs = [
  { name: "معمل الفا للتحاليل", km: "1.2", min: "5 دقائق", rating: "4.7" },
  { name: "المختبر الطبي الحديث", km: "2.4", min: "9 دقائق", rating: "4.5" },
];

const Lab = () => {
  const nav = useNavigate();
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">أقرب معمل تحليل</h1>
        <div className="w-10" />
      </div>

      <div className="relative rounded-3xl p-8 text-center overflow-hidden border border-border/60" style={{ background: "linear-gradient(160deg, hsl(var(--primary)/0.10), hsl(var(--primary)/0.02))" }}>
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-card shadow-[var(--shadow-card)] mb-3">
          <span className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/30" />
          <FlaskConical size={32} className="text-primary-deep relative" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-muted-foreground font-light">جارٍ البحث عن أقرب معمل تحليل...</p>
      </div>

      <button
        onClick={() => toast("🗺️ فتح الخريطة")}
        className="w-full mt-4 brand-button flex items-center justify-center gap-2"
      >
        <Navigation size={16} strokeWidth={1.8} />
        <span>فتح الخريطة</span>
      </button>

      <h2 className="text-right section-title mt-6 mb-3">معامل التحاليل القريبة</h2>

      <div className="space-y-2.5">
        {labs.map((b, i) => (
          <div key={i} className="surface-card">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">مفتوح الآن</span>
              <div className="text-right">
                <h3 className="text-sm font-semibold">{b.name}</h3>
                <div className="flex items-center justify-end gap-3 text-[11px] text-muted-foreground font-light mt-1">
                  <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" fill="currentColor" /> {b.rating}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {b.min}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {b.km} km</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toast("📞 جاري الاتصال")} className="flex-1 rounded-xl border border-primary/30 text-primary-deep py-2 text-sm font-medium flex items-center justify-center gap-1.5">
                <Phone size={14} /> اتصال
              </button>
              <button onClick={() => toast("🚗 بدء التوجيه")} className="flex-[2] rounded-xl py-2 text-white text-sm font-medium flex items-center justify-center gap-1.5" style={{ background: "var(--gradient-primary)" }}>
                <Navigation size={14} /> اذهب الآن
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
};

export default Lab;
