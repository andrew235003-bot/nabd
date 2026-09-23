import { ArrowRight, Camera, ChevronDown, ChevronUp, ClipboardList, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { pushToAssistantQueue } from "@/lib/storage";

type Result = "improving" | "worsening" | null;

const FollowUp = () => {
  const nav = useNavigate();
  const [oldImg, setOldImg] = useState<string | null>(null);
  const [newImg, setNewImg] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const oldRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);

  const [openSymptoms, setOpenSymptoms] = useState(true);
  const [day1, setDay1] = useState("");
  const [day1Saved, setDay1Saved] = useState<string | null>(null);
  const [day2, setDay2] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setter(url);
    setResult(null);
  };

  const runScan = () => {
    if (!oldImg || !newImg) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      // mock analysis
      setResult(Math.random() > 0.4 ? "improving" : "worsening");
    }, 2400);
  };

  const sendToAssistant = (text: string) => {
    pushToAssistantQueue({ from: "bot", text, ts: Date.now() });
  };

  const saveDay1 = () => {
    if (!day1.trim()) return;
    setDay1Saved(day1.trim());
  };

  const saveDay2 = () => {
    if (!day2.trim()) return;
    const improving = Math.random() > 0.4;
    const msg = improving
      ? "بناءً على تحليل أعراضك اليومية: أنت في تحسن مستمر 🌿 لا داعي للقلق، استمر في خطة العلاج."
      : "بناءً على تحليل أعراضك اليومية: حالتك في تدهور بسيط ⚠️ ننصح بزيارة أقرب مستشفى للاطمئنان.";
    sendToAssistant(msg);
    nav("/assistant");
  };

  return (
    <PhoneFrame variant="muted">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-medium flex-1 text-center text-foreground">متابعة الإصابة</h1>
        <div className="w-10" />
      </div>

      <p className="text-center text-xs text-muted-foreground mb-5 font-light">
        ارفع صورة الإصابة القديمة والجديدة لمقارنة التطور
      </p>

      {/* Upload area */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { img: oldImg, setter: setOldImg, ref: oldRef, label: "صورة سابقة" },
          { img: newImg, setter: setNewImg, ref: newRef, label: "صورة حالية" },
        ].map((slot, i) => (
          <div key={i}>
            <input
              ref={slot.ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e, slot.setter)}
            />
            <button
              onClick={() => slot.ref.current?.click()}
              className="relative w-full aspect-square rounded-2xl bg-card border-2 border-dashed border-border/70 hover:border-primary/60 active:scale-[.99] transition-all flex flex-col items-center justify-center gap-2 overflow-hidden group"
            >
              {slot.img ? (
                <>
                  <img src={slot.img} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 text-[10px] bg-card/90 backdrop-blur px-2 py-0.5 rounded-full font-light shadow-sm">
                    {slot.label}
                  </span>
                  <span className="absolute bottom-2 left-2 text-[10px] bg-primary/90 text-white px-2 py-0.5 rounded-full font-light">
                    تغيير
                  </span>
                  {scanning && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10" />
                      <div className="absolute left-0 right-0 h-[60%] -translate-y-1/2 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-md animate-scanline" />
                      <div className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_22px_6px_hsl(var(--primary))] animate-scanline" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary-deep group-hover:bg-primary/20 transition">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs text-muted-foreground font-light flex items-center gap-1">
                    <Camera size={12} /> {slot.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 font-light">اضغط للرفع</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={runScan}
        disabled={!oldImg || !newImg || scanning}
        className="w-full brand-button mb-4 disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, hsl(200 85% 74%), hsl(204 82% 66%) 55%, hsl(208 80% 58%))" }}
      >
        {scanning ? "جاري المسح والتحليل..." : "ابدأ المقارنة"}
      </button>

      {result === "improving" && (
        <div
          className="mb-5 rounded-3xl p-6 border-2 animate-float-in text-center"
          style={{ background: "hsl(140 60% 96%)", borderColor: "hsl(140 55% 75%)" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3"
            style={{ background: "hsl(140 55% 88%)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(140 55% 35%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2" style={{ color: "hsl(140 50% 28%)" }}>✅ تحسّن ملحوظ!</p>
          <p className="text-sm font-light leading-relaxed mb-3" style={{ color: "hsl(140 30% 32%)" }}>
            الإصابة تتحسن بشكل جيد. استمر على العلاج الحالي وراقب الحالة.
          </p>
          <button
            onClick={() => { setOldImg(null); setNewImg(null); setResult(null); }}
            className="text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: "hsl(140 50% 30%)" }}
          >
            مقارنة جديدة
          </button>
        </div>
      )}
      {result === "worsening" && (
        <div
          className="mb-5 rounded-3xl p-6 border-2 animate-float-in text-center"
          style={{ background: "hsl(0 75% 97%)", borderColor: "hsl(0 70% 80%)" }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3"
            style={{ background: "hsl(0 70% 92%)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="hsl(0 70% 45%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" /><path d="m9 9 6 6" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2" style={{ color: "hsl(0 65% 40%)" }}>⚠️ تدهور في الحالة</p>
          <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "hsl(0 35% 38%)" }}>
            الإصابة تبدو أسوأ من السابق. يُنصح بزيارة طبيب أو التوجه لأقرب مستشفى.
          </p>
          <button
            className="w-full rounded-2xl py-3 text-white font-medium mb-2 active:scale-[.99] transition"
            style={{ background: "hsl(0 70% 50%)" }}
          >
            التوجّه لأقرب مستشفى
          </button>
          <button
            onClick={() => { setOldImg(null); setNewImg(null); setResult(null); }}
            className="text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: "hsl(195 70% 45%)" }}
          >
            مقارنة جديدة
          </button>
        </div>
      )}

      {/* Daily symptoms log */}
      <div className="surface-card mb-3">
        <button
          onClick={() => setOpenSymptoms((v) => !v)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary-deep">
              <ClipboardList size={16} />
            </span>
            <span className="text-sm font-medium">سجّل أعراضك اليومية</span>
          </span>
          {openSymptoms ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>
      </div>

      {openSymptoms && (
        <div className="surface-card mb-32 space-y-4">
          {!day1Saved ? (
            <>
              <p className="text-sm font-medium text-right">أعراض اليوم الأول</p>
              <textarea
                value={day1}
                onChange={(e) => setDay1(e.target.value)}
                placeholder="اكتب أعراضك في اليوم الأول..."
                className="w-full min-h-[110px] rounded-xl bg-muted/40 border border-border/60 p-3 text-sm font-light outline-none focus:border-primary/50"
              />
              <button onClick={saveDay1} disabled={!day1.trim()} className="w-full brand-button disabled:opacity-50" style={{ background: "linear-gradient(135deg, hsl(200 85% 74%), hsl(204 82% 66%) 55%, hsl(208 80% 58%))" }}>
                حفظ أعراض اليوم الأول
              </button>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-muted/40 border border-border/60 p-3">
                <p className="text-[11px] text-muted-foreground mb-1 font-light">أعراض اليوم الأول (محفوظة)</p>
                <p className="text-sm font-light leading-relaxed">{day1Saved}</p>
              </div>

              <p className="text-sm font-medium text-right">أعراض اليوم التالي</p>
              <textarea
                value={day2}
                onChange={(e) => setDay2(e.target.value)}
                placeholder="اكتب أعراضك في اليوم التالي..."
                className="w-full min-h-[110px] rounded-xl bg-muted/40 border border-border/60 p-3 text-sm font-light outline-none focus:border-primary/50"
              />
              <button onClick={saveDay2} disabled={!day2.trim()} className="w-full brand-button disabled:opacity-50" style={{ background: "linear-gradient(135deg, hsl(200 85% 74%), hsl(204 82% 66%) 55%, hsl(208 80% 58%))" }}>
                حفظ وإرسال للمساعد
              </button>
            </>
          )}
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
};

export default FollowUp;
