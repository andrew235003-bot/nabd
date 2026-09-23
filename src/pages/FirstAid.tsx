import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle, CheckCircle2, ShoppingBag } from "lucide-react";

const SUPPLIES = [
  { name: "قطن طبي", icon: "🩹" },
  { name: "مطهر (بيتادين)", icon: "🧴" },
  { name: "شاش معقّم", icon: "🧻" },
  { name: "شريط لاصق طبي", icon: "📏" },
  { name: "قفازات طبية", icon: "🧤" },
  { name: "مقص صغير", icon: "✂️" },
];

const STEPS = [
  "اغسل يديك جيداً قبل لمس الجرح، وارتدِ قفازات إن أمكن.",
  "اضغط على الجرح بقطعة شاش نظيفة لإيقاف النزيف لمدة 5–10 دقائق.",
  "نظّف المنطقة بماء جارٍ ثم استخدم مطهراً مناسباً.",
  "غطِّ الجرح بضمادة معقمة وثبّتها بشريط لاصق.",
  "راقب الجرح يومياً، وراجع طبيباً إذا ظهر احمرار أو تورّم.",
];

const FirstAid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { withSupplies } = ((location.state as any) || {}) as { withSupplies?: boolean };

  return (
    <div dir="rtl" className="phone-frame bg-background pt-6 pb-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border text-primary active:scale-95"
        >
          <ArrowRight size={18} />
        </button>
        <h2 className="text-base font-semibold text-foreground">الإسعافات الأولية</h2>
        <div className="w-10" />
      </header>

      {/* Video */}
      <div className="mt-5 rounded-3xl overflow-hidden bg-card border border-border aspect-video relative">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/PG6q1qKO-T0"
          title="إسعافات أولية"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Supplies (only when light injuries) */}
      {withSupplies && (
        <section className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">المستلزمات الطبية المطلوبة</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SUPPLIES.map((s) => (
              <div key={s.name} className="rounded-2xl bg-card border border-border p-3 flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs font-medium text-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      <section className="mt-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">خطوات الإسعاف</h3>
        <ol className="space-y-2.5">
          {STEPS.map((s, i) => (
            <li key={i} className="rounded-2xl bg-card border border-border p-3 flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-xs leading-relaxed text-foreground/90 text-right">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Illustrative images */}
      <section className="mt-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">صور توضيحية</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs">
              صورة {i}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FirstAid;
