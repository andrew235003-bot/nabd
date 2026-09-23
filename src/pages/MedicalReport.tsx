import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Share2, Mail, MessageCircle } from "lucide-react";
import { getMedical, getSignup } from "@/lib/storage";

type Level = 1 | 2 | 3 | 4;

const LEVEL_META: Record<Level, { label: string; color: string }> = {
  1: { label: "بسيطة — يمكن إسعافها منزلياً", color: "hsl(145 70% 38%)" },
  2: { label: "متوسطة — يُنصح بزيارة صيدلية", color: "hsl(45 95% 45%)" },
  3: { label: "خطيرة — يُنصح بزيارة طبيب", color: "hsl(18 90% 50%)" },
  4: { label: "حرجة — توجه لأقرب مستشفى فوراً", color: "hsl(0 0% 12%)" },
};

const MedicalReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { image, level, diagnosis } = ((location.state as any) || {}) as {
    image?: string; level?: Level; diagnosis?: { type: string; depth: string; region: string };
  };

  const [user, setUser] = useState<{ name?: string; blood?: string; allergy?: string; chronic?: string }>({});
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const med = getMedical();
    const sup = getSignup();
    setUser({
      name: sup.name,
      blood: med.blood || "+A",
      allergy: (med.allergy as string) || "لا يوجد",
      chronic: (med.chronic as string) || "لا يوجد",
    });
  }, []);

  const lv = level ?? 3;
  const meta = LEVEL_META[lv];

  const summary = `تقرير نبض الطبي
المريض: ${user.name || "—"}
نوع الإصابة: ${diagnosis?.type || "—"}
العمق: ${diagnosis?.depth || "—"}
المنطقة: ${diagnosis?.region || "—"}
مستوى الخطورة: ${meta.label}
فصيلة الدم: ${user.blood}
الحساسية: ${user.allergy}
الأمراض المزمنة: ${user.chronic}`;

  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank");
  const shareMail = () => window.open(`mailto:?subject=${encodeURIComponent("تقرير نبض الطبي")}&body=${encodeURIComponent(summary)}`);

  return (
    <div dir="rtl" className="phone-frame bg-muted/30 pt-6 pb-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-primary active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">تقرير تفصيلي</h2>
        </div>
        <div className="relative">
          <button
            onClick={() => setShareOpen((v) => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-primary active:scale-95"
            aria-label="مشاركة"
          >
            <Share2 size={16} />
          </button>
          {shareOpen && (
            <div className="absolute top-12 left-0 z-10 w-44 rounded-2xl bg-card border border-border shadow-xl overflow-hidden animate-float-in">
              <button onClick={shareWA} className="w-full flex items-center gap-2 px-4 py-3 text-xs hover:bg-muted/50 text-right">
                <MessageCircle size={14} className="text-green-600" /> واتساب
              </button>
              <button onClick={shareMail} className="w-full flex items-center gap-2 px-4 py-3 text-xs hover:bg-muted/50 text-right border-t border-border">
                <Mail size={14} className="text-primary" /> البريد الإلكتروني
              </button>
            </div>
          )}
        </div>
      </header>

      <article className="mt-5 rounded-3xl bg-card border border-border p-5 shadow-[0_10px_30px_-15px_hsl(220_30%_30%/.15)]">
        {/* Image */}
        <div className="rounded-2xl bg-muted/60 border border-border aspect-[4/3] overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt="injury" className="w-full h-full object-cover" />
          ) : (
            <span className="text-muted-foreground text-sm">صورة الإصابة مع تحديد المكان</span>
          )}
        </div>

        {/* Sections */}
        <div className="mt-5 space-y-4">
          <Field label="تشخيص AI" value={`${diagnosis?.type || "—"} بعمق تقديري ${diagnosis?.depth || "—"} في ${diagnosis?.region || "—"}`} />
          <Field label="مستوى الخطورة">
            <span className="font-bold" style={{ color: meta.color }}>{meta.label}</span>
          </Field>
          <Field label="فصيلة الدم" value={user.blood} />
          <Field label="الحساسية" value={user.allergy} />
          <Field label="الأمراض المزمنة" value={user.chronic} />
        </div>
      </article>
    </div>
  );
};

const Field = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="border-b border-border/60 last:border-0 pb-3 last:pb-0 text-right">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    {children ?? <p className="text-sm font-semibold text-foreground">{value}</p>}
  </div>
);

export default MedicalReport;
