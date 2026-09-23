import { ArrowRight, Clock, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getRecords, setRecords as saveRecords, type MedicalRecord } from "@/lib/storage";

type Record = MedicalRecord;

const defaults: Record[] = [
  { title: "جرح قطعي", part: "الساعد", date: "2026-03-20", level: "yellow" },
  { title: "حرق سطحي", part: "اليد", date: "2026-03-15", level: "green" },
  { title: "كسر محتمل", part: "الكاحل", date: "2026-03-10", level: "red" },
];

const colorOf = (l: Record["level"]) =>
  l === "green" ? "bg-emerald-500" : l === "yellow" ? "bg-amber-400" : "bg-red-500";

const Records = () => {
  const nav = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record>({
    title: "", part: "", date: new Date().toISOString().slice(0, 10), level: "green",
  });

  useEffect(() => {
    const saved = getRecords();
    setRecords(saved ?? defaults);
  }, []);

  const save = (next: Record[]) => {
    setRecords(next);
    saveRecords(next);
  };

  const addRecord = () => {
    if (!form.title.trim() || !form.part.trim()) {
      toast.error("اكملي البيانات");
      return;
    }
    save([{ ...form }, ...records]);
    setForm({ title: "", part: "", date: new Date().toISOString().slice(0, 10), level: "green" });
    setOpen(false);
    toast.success("تمت إضافة التسجيل");
  };

  const deleteRecord = (index: number) => {
    save(records.filter((_, i) => i !== index));
    toast.success("تم مسح التسجيل");
  };

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">السجل الطبي</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="w-10 h-10 rounded-full inline-flex items-center justify-center text-white shadow-[var(--shadow-button)] active:scale-95 transition"
              style={{ background: "var(--gradient-primary)" }}
              aria-label="إضافة تسجيل"
            >
              <Plus size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[360px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة تسجيل جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <input
                className="field"
                placeholder="نوع الإصابة (مثل: جرح قطعي)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className="field"
                placeholder="الجزء المصاب (مثل: اليد)"
                value={form.part}
                onChange={(e) => setForm({ ...form, part: e.target.value })}
              />
              <input
                type="date"
                className="field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <div className="flex items-center justify-between gap-2">
                {(["green", "yellow", "red"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm({ ...form, level: l })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm flex items-center justify-center gap-2 transition ${
                      form.level === l ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${colorOf(l)}`} />
                    {l === "green" ? "خفيف" : l === "yellow" ? "متوسط" : "شديد"}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <button className="brand-button mt-2" onClick={addRecord}>حفظ</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {records.map((r, i) => (
          <div key={i} className="surface-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => deleteRecord(i)}
                aria-label="مسح التسجيل"
                className="w-8 h-8 rounded-full inline-flex items-center justify-center text-red-500 bg-red-500/10 active:scale-95 transition tap-glow"
              >
                <Trash2 size={15} />
              </button>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
                <span>{r.date}</span>
                <Clock size={12} />
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <h3 className="text-sm font-semibold">{r.title}</h3>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{r.part}</p>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${colorOf(r.level)}`} />
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
};

export default Records;
