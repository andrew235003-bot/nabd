import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, AlertTriangle, AlertOctagon, XCircle,
  Phone, MapPin, FileText, Share2, Pill, Stethoscope,
} from "lucide-react";
import { getLastLevel, setLastLevel } from "@/lib/storage";

type Level = 1 | 2 | 3 | 4;

const LEVELS: Record<Level, {
  title: string; desc: string; color: string; soft: string; Icon: typeof Check;
}> = {
  1: {
    title: "إصابة بسيطة",
    desc: "لا داعي للقلق — يمكن إسعافها منزلياً.",
    color: "hsl(145 70% 42%)",
    soft: "hsl(145 70% 96%)",
    Icon: Check,
  },
  2: {
    title: "إصابة متوسطة",
    desc: "تحتاج عناية ومتابعة، يُفضّل زيارة صيدلية.",
    color: "hsl(45 95% 50%)",
    soft: "hsl(45 95% 96%)",
    Icon: AlertTriangle,
  },
  3: {
    title: "حالة خطيرة",
    desc: "يُنصح بالتوجّه إلى أقرب مستشفى.",
    color: "hsl(18 90% 52%)",
    soft: "hsl(18 90% 96%)",
    Icon: AlertOctagon,
  },
  4: {
    title: "حالة حرجة للغاية",
    desc: "خطر على الحياة — اتصل بالإسعاف فوراً وتوجّه لأقرب مستشفى",
    color: "hsl(0 0% 8%)",
    soft: "hsl(0 0% 96%)",
    Icon: XCircle,
  },
};

const STAGES = ["كشف الإصابة", "تحليل النسيج", "تقييم الشدّة", "تحديد المستوى"];

const Scan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const img = (location.state as { image?: string } | null)?.image;
  const [stage, setStage] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    if (!img) { navigate("/home", { replace: true }); return; }
    const timers: number[] = [];
    [700, 1400, 2100].forEach((t, i) => {
      timers.push(window.setTimeout(() => setStage(i + 1), t));
    });
    timers.push(window.setTimeout(() => {
      // Cycle through all 4 levels across scans so user can see every state
      const last = getLastLevel();
      const next = ((last % 4) + 1) as Level;
      setLastLevel(next);
      setLevel(next);
    }, 2900));
    return () => timers.forEach(clearTimeout);
  }, [img, navigate]);

  const accent = level ? LEVELS[level].color : "hsl(195 80% 55%)";
  const isGreen = level === 1;
  const isCritical = level === 4;
  const needsHospital = level === 2 || level === 3 || level === 4;
  const diagnosis = {
    type: "جرح قطعي",
    depth: "~2 cm",
    region: "الساعد الأيسر",
  };

  const goHospital = () => navigate("/hospital", { state: { image: img, level, diagnosis } });
  const goPharmacy = () => navigate("/pharmacy", { state: { image: img, level, diagnosis } });
  const goReport = () => navigate("/medical-report", { state: { image: img, level, diagnosis } });
  const goFirstAid = () => navigate("/first-aid", { state: { level, withSupplies: isGreen } });

  return (
    <div dir="rtl" className="phone-frame bg-background pt-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-primary active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
        <h2 className="text-base font-semibold text-foreground">نتيجة التحليل</h2>
        <div className="w-10" />
      </div>

      {/* Result card with 4 lamps */}
      <div className="mt-5 rounded-3xl bg-card border border-border p-6 shadow-[0_8px_30px_-15px_hsl(220_30%_30%/.15)]">
        {/* Lamps */}
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3, 4].map((i) => {
            const isActive = level === i;
            const lampColor = LEVELS[i as Level].color;
            return (
              <div
                key={i}
                className="w-14 h-14 rounded-full transition-all duration-700"
                style={{
                  background: isActive ? lampColor : "hsl(220 14% 92%)",
                  boxShadow: isActive
                    ? `0 0 0 6px ${lampColor}22, 0 8px 28px -4px ${lampColor}88`
                    : "inset 0 2px 6px hsl(220 14% 85%)",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              />
            );
          })}
        </div>

        {/* Status */}
        <div className="mt-6 flex flex-col items-center text-center">
          {!level ? (
            <>
              <p className="text-sm text-muted-foreground" key={stage}>
                {STAGES[stage]}...
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: i <= stage ? 24 : 14,
                      background: i <= stage ? accent : "hsl(220 14% 88%)",
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {(() => {
                const Icon = LEVELS[level].Icon;
                return (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-2 animate-float-in"
                    style={{ background: LEVELS[level].soft, color: LEVELS[level].color }}
                  >
                    <Icon size={26} />
                  </div>
                );
              })()}
              <h3 className="text-lg font-bold" style={{ color: LEVELS[level].color }}>
                {LEVELS[level].title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[260px]">
                {LEVELS[level].desc}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Diagnosis details */}
      {level && (
        <div className="mt-4 rounded-3xl bg-card border border-border p-5 animate-float-in">
          <h4 className="text-base font-semibold text-foreground text-right mb-3">تفاصيل التشخيص</h4>
          <div className="space-y-2.5 text-sm">
            <Row label="نوع الإصابة" value={diagnosis.type} />
            <Row label="العمق التقديري" value={diagnosis.depth} />
            <Row label="المنطقة" value={diagnosis.region} />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {level && (
        <div className="mt-4 space-y-3 animate-float-in">
          {isCritical && (
            <a
              href="tel:123"
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white active:scale-[.98] transition shadow-lg"
              style={{ background: LEVELS[level].color, boxShadow: `0 10px 24px -10px ${LEVELS[level].color}` }}
            >
              <AlertTriangle size={16} /> حالة حرجة — اتصل بالإسعاف فوراً!
            </a>
          )}
          {needsHospital && (
            <ActionButton
              icon={<MapPin size={16} />}
              label="توجّه لأقرب مستشفى"
              onClick={goHospital}
              primary={!isCritical}
              tint={LEVELS[level].color}
            />
          )}
          {isGreen && (
            <>
              <ActionButton icon={<Pill size={16} />} label="تحديد أقرب صيدلية" onClick={goPharmacy} primary tint={LEVELS[level].color} />
              <ActionButton icon={<Stethoscope size={16} />} label="عرض الإسعافات الأولية" onClick={goFirstAid} />
            </>
          )}
          {!isGreen && (
            <div className="flex items-center gap-2">
              <button
                onClick={goReport}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium bg-card border border-border text-foreground hover:bg-muted/40 transition active:scale-[.98]"
              >
                <FileText size={16} /> التقرير الطبي للحالة
              </button>
              <button
                onClick={() => {
                  const text = encodeURIComponent(`تقرير نبض الطبي — ${LEVELS[level].title}`);
                  window.open(`https://wa.me/?text=${text}`, "_blank");
                }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-card border border-border text-primary hover:bg-muted/40 transition active:scale-95"
                aria-label="مشاركة"
              >
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border/60 last:border-0 pb-2 last:pb-0">
    <span className="text-foreground font-medium">{value}</span>
    <span className="text-muted-foreground">{label}</span>
  </div>
);

const ActionButton = ({
  icon, label, onClick, primary, tint,
}: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean; tint?: string }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold active:scale-[.98] transition"
    style={
      primary && tint
        ? { background: tint, color: "white", boxShadow: `0 10px 22px -10px ${tint}` }
        : { background: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))" }
    }
  >
    {icon} {label}
  </button>
);

export default Scan;
