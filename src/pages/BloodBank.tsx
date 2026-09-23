import { ArrowRight, Droplet, MapPin, Navigation, Phone, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";

const banks = [
  { name: "بنك دم المركزي", km: "1.5", min: "6 دقائق", rating: "4.6" },
  { name: "بنك دم الهلال الأحمر", km: "3.0", min: "11 دقيقة", rating: "4.4" },
];

const BloodBank = () => {
  const nav = useNavigate();
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">أقرب بنك دم</h1>
        <div className="w-10" />
      </div>

      {/* Map hero */}
      <div
        className="relative rounded-3xl p-8 text-center overflow-hidden border border-border/60"
        style={{ background: "linear-gradient(160deg, hsl(0 80% 96%), hsl(0 80% 99%))" }}
      >
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-card shadow-[var(--shadow-card)] mb-3">
          <span className="absolute inset-0 rounded-full animate-pulse-ring bg-red-400/40" />
          <Droplet size={30} className="text-red-500 relative" fill="currentColor" />
        </div>
        <p className="text-sm text-muted-foreground font-light">جارٍ البحث عن أقرب بنك دم...</p>
      </div>

      {/* Map action */}
      <button
        onClick={() => toast("🗺️ فتح الخريطة")}
        className="w-full mt-4 rounded-2xl py-3.5 text-white text-base font-medium flex items-center justify-center gap-2 active:scale-[.98] transition"
        style={{ background: "linear-gradient(135deg, hsl(0 75% 65%), hsl(0 70% 55%))", boxShadow: "0 10px 24px -10px hsl(0 75% 60% / 0.5)" }}
      >
        <Navigation size={16} strokeWidth={1.8} />
        <span>فتح الخريطة</span>
      </button>

      <h2 className="text-right section-title mt-6 mb-3">بنوك الدم القريبة منك</h2>

      <div className="space-y-3">
        {banks.map((b, i) => (
          <div
            key={i}
            className="rounded-3xl bg-card p-4 border border-border/60"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="text-right flex-1 min-w-0">
                <h3 className="text-sm font-semibold leading-snug">{b.name}</h3>
                <div className="flex items-center justify-end gap-3 text-[11px] text-muted-foreground font-light mt-1.5">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {b.km} km</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {b.min}</span>
                  <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" fill="currentColor" /> {b.rating}</span>
                </div>
              </div>
              <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-red-50 text-red-500 font-medium">متاح</span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => toast("🚗 بدء التوجيه")}
                className="flex-[2] rounded-2xl py-2.5 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-[.98]"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-button)" }}
              >
                <Navigation size={13} />
                <span>اذهب الآن</span>
              </button>
              <button
                onClick={() => toast("📞 جاري الاتصال")}
                className="flex-1 rounded-2xl border border-primary/30 text-primary-deep py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-[.98] bg-primary/5"
              >
                <Phone size={13} />
                <span>اتصال</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
};

export default BloodBank;
