import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X, Pill, AlertTriangle, Search } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ORGAN_MEDICATIONS } from "@/lib/organMedications";

const OrganIcon = ({ organ }: { organ: string }) => {
  const common = "w-full h-full";
  switch (organ) {
    case "nose":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 10c-4 0-6 4-6 9 0 5 2 8 2 13 0 6-5 8-5 14 0 6 4.5 10 9 10s9-4 9-10c0-6-5-8-5-14 0-5 2-8 2-13 0-5-2-9-6-9z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M23 42c-2.5 1.5-4 4-4 7" />
          <path d="M41 42c2.5 1.5 4 4 4 7" />
        </svg>
      );
    case "ear":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M40 12c8 2 12 10 11 18-0.5 5-3 9-6 13-2.5 3-4 6-4 9 0 4-3 7-7 7s-7-3-7-7"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path d="M36 20c4 2 6 7 4.5 12-1 3.5-3.5 6-6.5 7.5" />
          <path d="M32 30c1.5 1 2 3 1 4.5" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 32c4-9 14-16 26-16s22 7 26 16c-4 9-14 16-26 16S10 41 6 32z" fill="currentColor" fillOpacity="0.06" />
          <circle cx="32" cy="32" r="9" fill="currentColor" fillOpacity="0.14" />
          <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity="0.55" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 50c-12-8-20-16-20-26 0-6.5 4.5-11 10.5-11 4.5 0 8 2.5 9.5 6.5 1.5-4 5-6.5 9.5-6.5 6 0 10.5 4.5 10.5 11 0 10-8 18-20 26z"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <path d="M22 32h6l3-6 4 10 3-6h4" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 12c-8 0-13 5-14 11-4 1-7 5-6.5 9.5 0.5 4 3.5 6.5 7 7-1 4 1.5 8 6 8.5 1 2.5 3.5 4 6.5 4h2c3 0 5.5-1.5 6.5-4 4.5-0.5 7-4.5 6-8.5 3.5-0.5 6.5-3 7-7 0.5-4.5-2.5-8.5-6.5-9.5-1-6-6-11-14-11z"
            fill="currentColor"
            fillOpacity="0.08"
          />
          <path d="M32 14v34" />
          <path d="M25 22c2.5-1 5-1 7 0.5" />
          <path d="M25 30c2.5 1.3 5 1.3 7-0.2" />
          <path d="M25 38c2.5 1 5 1 7-0.3" />
        </svg>
      );
    case "throat":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25 8h14l1 12c1 3 3 5 3 10 0 8-5 14-11 14s-11-6-11-14c0-5 2-7 3-10z" fill="currentColor" fillOpacity="0.1" />
          <path d="M25 24h14" />
          <path d="M27 30h10" />
          <path d="M26 46c1.5 3 4 5 6 5s4.5-2 6-5" />
        </svg>
      );
    case "mouth":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M32 10c4 0 7 3 7.5 7 3-1 6 1 6 5 0 3-1 5-1.5 9-0.5 4-1 12-2 16-1 4-4 7-7 7s-4.5-2.5-5-5c-0.5 2.5-2 5-5 5s-6-3-7-7c-1-4-1.5-12-2-16-0.5-4-1.5-6-1.5-9 0-4 3-6 6-5 0.5-4 3.5-7 7.5-7z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M32 17v10" />
        </svg>
      );
    case "lungs":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 10v10" />
          <path d="M32 20c-3-3-7-3-9-1" />
          <path d="M32 20c3-3 7-3 9-1" />
          <path
            d="M25 19c-7 1-12 8-12 20 0 6 3 9 8 8 6-1.5 9-8 9-18V19z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path
            d="M39 19c7 1 12 8 12 20 0 6-3 9-8 8-6-1.5-9-8-9-18V19z"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
      );
    case "stomach":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 10c-1 4-1 6-4 8-5 3-8 9-8 16 0 10 7 17 17 17 8 0 15-5 16-13 1-6-2-10-7-11-4-1-6-3-6-7 0-4 1-7-1-9-2-2-5-2-7-1z" fill="currentColor" fillOpacity="0.1" />
          <path d="M25 30c4 1 7 4 7 9" />
        </svg>
      );
    case "liver":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M11 26c1-6 6-10 12-11 3-3 8-5 13-4 7 1 13 6 15 13 2 7-1 14-8 17-3 1.5-4 3-7 4-6 2-13 1-17-3-5-4-8-10-8-16z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M22 24c3 3 5 8 4 13" />
          <path d="M33 21c2 4 2 10-1 14" />
        </svg>
      );
    case "kidney":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M24 10c11 0 18 9 18 21s-7 21-18 21c-5 0-9-4-9-10v-8c3 1 6 0 7-3 1-3-0.5-5.5-3.5-7-3-1.5-4.5-4-4.5-7 0-4 4-7 10-7z"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M42 44c3 2 4 6 3 9" />
        </svg>
      );
    case "skin":
      return (
        <svg viewBox="0 0 64 64" className={common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 22c9-6 37-6 46 0" />
          <path d="M9 32c9-5 37-5 46 0" />
          <path d="M9 42c9-5 37-5 46 0" />
          <circle cx="20" cy="27" r="1.8" fill="currentColor" fillOpacity="0.4" />
          <circle cx="41" cy="37" r="1.8" fill="currentColor" fillOpacity="0.4" />
          <circle cx="27" cy="47" r="1.8" fill="currentColor" fillOpacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
};

const organs = [
  { key: "heart", name: "القلب", color: "text-rose-500", bg: "bg-rose-50", desc: "بعض الأدوية ترفع ضغط الدم أو تؤثر على نبضات القلب." },
  { key: "brain", name: "المخ", color: "text-violet-500", bg: "bg-violet-50", desc: "الاستخدام الخاطئ قد يسبب صداع، دوخة، أو اضطرابات نوم." },
  { key: "lungs", name: "الرئة", color: "text-sky-500", bg: "bg-sky-50", desc: "أدوية معينة تضيق المسالك الهوائية أو تسبب ضيق تنفس." },
  { key: "throat", name: "الحلق", color: "text-red-500", bg: "bg-red-50", desc: "بعض البخاخات والأدوية قد تهيّج الحلق أو تخفي التهاباته." },
  { key: "mouth", name: "الفم والأسنان", color: "text-blue-500", bg: "bg-blue-50", desc: "سوء استخدام الغسولات والمخدرات الموضعية يسبب تهيّج اللثة." },
  { key: "stomach", name: "المعدة", color: "text-amber-500", bg: "bg-amber-50", desc: "تقرحات وآلام وغثيان من تناول الأدوية بدون طعام أو رقابة." },
  { key: "liver", name: "الكبد", color: "text-orange-500", bg: "bg-orange-50", desc: "الكبد هو مصنع الدواء؛ الجرعات الزائدة تؤذيه بشكل مباشر." },
  { key: "kidney", name: "الكلى", color: "text-emerald-500", bg: "bg-emerald-50", desc: "تناول المسكنات بكثرة قد يقلل وظائف الكلى تدريجياً." },
  { key: "eye", name: "العين", color: "text-cyan-600", bg: "bg-cyan-50", desc: "بعض القطرات والأدوية ترفع ضغط العين أو تسبب جفافها." },
  { key: "ear", name: "الأذن", color: "text-indigo-500", bg: "bg-indigo-50", desc: "المضادات الحيوية الخاطئة قد تؤدي إلى طنين أو ضعف سمع." },
  { key: "nose", name: "الأنف", color: "text-pink-500", bg: "bg-pink-50", desc: "إفراط بخاخات الأنف يسبب اعتياداً وتهيجاً في الغشاء المخاطي." },
  { key: "skin", name: "الجلد", color: "text-teal-500", bg: "bg-teal-50", desc: "الكريمات والمضادات غير المناسبة تسبب حساسية أو تقشراً." },
];

const Information = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const selectedOrgan = organs.find((o) => o.key === selected) || null;
  const medications = selected ? ORGAN_MEDICATIONS[selected] || [] : [];

  // إحصائيات عامة تُحسب من البيانات الفعلية المسجّلة
  const organsCount = organs.length;
  const totalMeds = organs.reduce((sum, o) => sum + (ORGAN_MEDICATIONS[o.key]?.length || 0), 0);
  const totalEffects = organs.reduce(
    (sum, o) =>
      sum + (ORGAN_MEDICATIONS[o.key]?.reduce((s, m) => s + m.sideEffects.length, 0) || 0),
    0
  );

  // فلترة الأعضاء حسب البحث (اسم العضو، الوصف، أو اسم دواء مرتبط به)
  const filteredOrgans = organs.filter((organ) => {
    const q = query.trim();
    if (!q) return true;
    if (organ.name.includes(q) || organ.desc.includes(q)) return true;
    const meds = ORGAN_MEDICATIONS[organ.key] || [];
    return meds.some(
      (m) => m.name.includes(q) || m.sideEffects.some((e) => e.includes(q))
    );
  });

  return (
    <PhoneFrame variant="muted">
      <button
        onClick={() => navigate("/home")}
        className="icon-bubble tap-glow w-10 h-10 mb-4"
        aria-label="رجوع"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="text-right mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">معلومات</h1>
        <p className="text-muted-foreground text-xs font-light mt-1">تعرف على تأثير الأدوية على جسمك</p>
      </div>

      <div className="surface-card mb-5 bg-gradient-to-br from-primary/10 to-accent/30 border-primary/20">
        <p className="text-sm font-medium text-foreground/90 text-right leading-relaxed">
          بالتفصيل أضرار تحدث عند استخدام أدوية بدون إشراف الطبيب
        </p>
        <p className="text-xs text-muted-foreground font-light text-right mt-2">
          اضغط على أي عضو لمعرفة المخاطر الشائعة المرتبطة به.
        </p>
      </div>

      {/* شريط البحث */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن عضو أو مرض أو دواء"
          className="surface-card w-full py-3 pr-10 pl-3.5 text-right text-sm font-light placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* إحصائيات عامة */}
      <div className="surface-card mb-5 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-primary">{totalMeds}</p>
          <p className="text-[11px] text-muted-foreground font-light mt-0.5">دواء متداول</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-primary">{totalEffects}</p>
          <p className="text-[11px] text-muted-foreground font-light mt-0.5">إصابة ومرض</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-primary">{organsCount}</p>
          <p className="text-[11px] text-muted-foreground font-light mt-0.5">عضوًا</p>
        </div>
        <p className="col-span-3 text-[10px] text-muted-foreground/80 font-light text-center pt-2 mt-1 border-t border-border/60">
          استرشادية ولا تغني عن رأي الطبيب أو الصيدلي
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6">
        {filteredOrgans.length === 0 && (
          <p className="col-span-2 text-xs text-muted-foreground font-light text-center py-8">
            لا توجد نتائج مطابقة لبحثك
          </p>
        )}
        {filteredOrgans.map((organ) => (
          <button
            key={organ.key}
            onClick={() => setSelected(organ.key)}
            className="surface-card tap-glow active:scale-[.98] text-right p-3.5 flex flex-col items-end gap-3 transition hover:bg-accent/40"
          >
            <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${organ.bg} ${organ.color} shadow-sm`}>
              <OrganIcon organ={organ.key} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground/90">{organ.name}</h3>
              <p className="text-[11px] text-muted-foreground font-light mt-1 leading-5">{organ.desc}</p>
              <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-muted-foreground font-light">
                <span>اضغط للتفاصيل</span>
                <span className="text-border">—</span>
                <span>
                  {ORGAN_MEDICATIONS[organ.key]?.length || 0} دواء
                </span>
                <span className="text-border">•</span>
                <span>
                  {ORGAN_MEDICATIONS[organ.key]?.reduce((s, m) => s + m.sideEffects.length, 0) || 0} إصابة
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* قائمة الأدوية وأضرارها */}
      {selectedOrgan && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 sm:p-5"
          onClick={() => setSelected(null)}
        >
          <div
            className="surface-card w-full sm:max-w-sm max-h-[85vh] overflow-y-auto rounded-b-none sm:rounded-2xl animate-float-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between sticky top-0 bg-card pb-3 mb-1 border-b border-border/60">
              <button
                onClick={() => setSelected(null)}
                aria-label="إغلاق"
                className="icon-bubble w-9 h-9"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-right">
                <div>
                  <h3 className="section-title">{selectedOrgan.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-light">أشهر الأدوية وأضرارها الشائعة</p>
                </div>
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${selectedOrgan.bg} ${selectedOrgan.color} shrink-0`}>
                  <OrganIcon organ={selectedOrgan.key} />
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              {medications.length === 0 && (
                <p className="text-xs text-muted-foreground font-light text-center py-6">
                  لا توجد بيانات مسجّلة لهذا العضو حالياً
                </p>
              )}
              {medications.map((med, i) => (
                <div key={i} className="rounded-2xl bg-muted/40 border border-border/60 p-3.5 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <h4 className="text-sm font-semibold text-foreground/90">{med.name}</h4>
                    <span className="icon-bubble w-8 h-8 shrink-0">
                      <Pill size={14} />
                    </span>
                  </div>
                  {med.note && (
                    <p className="text-[11px] text-muted-foreground font-light mt-1">{med.note}</p>
                  )}
                  <div className="mt-2.5 space-y-1.5">
                    {med.sideEffects.map((effect, j) => (
                      <div key={j} className="flex items-start gap-2 justify-end">
                        <p className="text-xs text-foreground/80 font-light leading-relaxed">{effect}</p>
                        <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/80 font-light text-center pt-4 pb-2 leading-relaxed">
              هذه المعلومات للتوعية العامة فقط ولا تغني عن استشارة طبيب أو صيدلي
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
};

export default Information;
