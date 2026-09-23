import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Camera, Droplet, Globe, Image as ImageIcon, Moon, Sun, Pill,
  ClipboardList, Activity, X,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { SideMenu } from "@/components/SideMenu";
import { useDarkMode, useLang } from "@/hooks/useAppPrefs";
import { loadReminders, type Reminder as ReminderType } from "@/lib/reminders";
import { getMedical, getSignup, updateMedical } from "@/lib/storage";
import { toast } from "sonner";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
type MedicalData = { age?: number; blood?: string; chronicCount?: number; name?: string };

const Home = () => {
  const navigate = useNavigate();
  const { dark, toggle: toggleDark } = useDarkMode();
  const { lang, toggle: toggleLang } = useLang();
  const [data, setData] = useState<MedicalData>({});
  const [reminders, setReminders] = useState<ReminderType[]>([]);
  const [editing, setEditing] = useState<null | "blood" | "age" | "chronic">(null);
  const [form, setForm] = useState({ age: "", blood: "", chronicCount: "" });
  const camRef = useRef<HTMLInputElement>(null);
  const upRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const med = getMedical();
    const sup = getSignup();
    setData({ ...med, name: sup.name });
    setReminders(loadReminders());
  }, []);

  const openEdit = (field: "blood" | "age" | "chronic") => {
    setForm({
      age: data.age != null ? String(data.age) : "",
      blood: data.blood || "",
      chronicCount: data.chronicCount != null ? String(data.chronicCount) : "",
    });
    setEditing(field);
  };

  const saveEdit = () => {
    const next = updateMedical({
      age: form.age ? Number(form.age) : undefined,
      blood: form.blood,
      chronicCount: form.chronicCount ? Number(form.chronicCount) : 0,
    });
    setData((d) => ({ ...d, ...next }));
    setEditing(null);
    toast.success("تم تحديث بياناتك");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    e.target.value = "";
    navigate("/scan", { state: { image: url } });
  };


  return (
    <PhoneFrame variant="muted">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <SideMenu />
          <button
            onClick={() => { toggleDark(); toast.success(dark ? (lang === "AR" ? "الوضع النهاري" : "Light mode") : (lang === "AR" ? "الوضع الليلي" : "Dark mode")); }}
            className="icon-bubble tap-glow w-10 h-10"
            aria-label="toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => { toggleLang(); toast.success(lang === "AR" ? "Switched to English" : "تم التحويل إلى العربية"); }}
            className="icon-bubble tap-glow w-10 h-10 px-3 gap-1 text-xs font-medium"
            style={{ width: "auto" }}
          >
            <Globe size={14} className="ml-1" /> {lang === "AR" ? "EN" : "AR"}
          </button>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold flex items-center gap-2 justify-end tracking-tight">
            <span>أهلاً{data.name ? ` ${data.name.split(" ")[0]}` : ""}</span>
            <span>👋</span>
          </h2>
          <p className="text-muted-foreground text-xs font-light mt-0.5">كيف يمكننا مساعدتك اليوم؟</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mt-5">
        <Stat onClick={() => openEdit("blood")} icon={<Droplet className="text-destructive" size={18} />} label="فصيلة الدم" value={data.blood || "—"} />
        <Stat onClick={() => openEdit("age")} icon={<Activity className="text-emerald-500" size={18} />} label="العمر" value={data.age ?? "—"} />
        <Stat onClick={() => openEdit("chronic")} icon={<Bell className="text-amber-500" size={18} />} label="الأمراض" value={data.chronicCount ?? 0} />
      </div>

      {/* Reminders */}
      <div className="surface-card mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="muted-label">اليوم</span>
          <h3 className="section-title flex items-center gap-2">
            <span>التذكيرات</span>
            <Bell size={16} className="text-primary-deep" />
          </h3>
        </div>
        {reminders.length === 0 && (
          <p className="text-xs text-muted-foreground font-light text-center py-3">مفيش تذكيرات — ضيفيها من أيقونة الجرس</p>
        )}
        {reminders.map((r, i) => (
          <Reminder
            key={i}
            icon={i === 0 ? <Pill size={16} /> : i === 1 ? <ClipboardList size={16} /> : <Bell size={16} />}
            title={r.title}
            sub={`الساعة ${r.time}`}
          />
        ))}
      </div>

      {/* Edit medical stats */}
      {editing && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-5" onClick={() => setEditing(null)}>
          <div className="surface-card w-full max-w-xs space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <button onClick={() => setEditing(null)} aria-label="إغلاق" className="icon-bubble w-8 h-8">
                <X size={15} />
              </button>
              <h3 className="section-title">
                {editing === "blood" ? "تعديل فصيلة الدم" : editing === "age" ? "تعديل العمر" : "تعديل عدد الأمراض"}
              </h3>
            </div>
            {editing === "blood" && (
              <select className="field" value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })}>
                <option value="">فصيلة الدم</option>
                {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            )}
            {editing === "age" && (
              <input
                className="field"
                inputMode="numeric"
                placeholder="العمر"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value.replace(/\D/g, "").slice(0, 3) })}
              />
            )}
            {editing === "chronic" && (
              <input
                className="field"
                inputMode="numeric"
                placeholder="عدد الأمراض المزمنة"
                value={form.chronicCount}
                onChange={(e) => setForm({ ...form, chronicCount: e.target.value.replace(/\D/g, "").slice(0, 2) })}
              />
            )}
            <button className="brand-button" onClick={saveEdit}>حفظ التعديل</button>
          </div>
        </div>
      )}


      {/* Hidden inputs */}
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <input ref={upRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Camera button */}
      <button
        onClick={() => camRef.current?.click()}
        className="brand-button mt-3 flex items-center justify-between text-right p-4 py-4"
      >
        <span className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-sm ring-1 ring-white/25 shrink-0">
          <Camera size={20} />
        </span>
        <div className="flex-1 text-right pr-3">
          <h4 className="text-base font-medium">فتح الكاميرا</h4>
          <p className="text-xs text-white/85 font-light mt-0.5">التقط صورة للإصابة مباشرة</p>
        </div>
      </button>

      {/* Upload button - elegant soft gray */}
      <button
        onClick={() => upRef.current?.click()}
        className="mt-3 w-full flex items-center justify-between text-right p-4 py-4 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300/80 hover:from-slate-300 hover:to-slate-400/70 active:scale-[.99] transition-all border border-slate-300/80 shadow-sm"
      >
        <span className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white ring-1 ring-slate-300 text-slate-700 shadow-sm">
          <ImageIcon size={20} />
        </span>
        <div className="flex-1 text-right pr-3">
          <h4 className="text-base font-medium text-slate-800">تحميل صورة</h4>
          <p className="text-xs text-slate-600 font-light mt-0.5">اختر صورة من المعرض</p>
        </div>
      </button>

      <BottomNav />
    </PhoneFrame>
  );
};

const Stat = ({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: React.ReactNode; onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="stat-card tap-glow active:scale-[.98] transition text-center">
    {icon}
    <span className="muted-label">{label}</span>
    <span className="text-base font-semibold">{value}</span>
  </button>
);

const Reminder = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-center gap-3 py-2">
    <span className="icon-bubble w-9 h-9 shrink-0">{icon}</span>
    <div className="text-right flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground font-light">{sub}</p>
    </div>
  </div>
);

export default Home;
