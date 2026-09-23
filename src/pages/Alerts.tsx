import { ArrowRight, Bell, BellRing, Check, Clock, Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { loadReminders, saveReminders, type Reminder } from "@/lib/reminders";
import {
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
} from "@/hooks/useReminderAlarms";

export type { Reminder };

const Alerts = () => {
  const nav = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setReminders(loadReminders());
  }, []);

  const save = (next: Reminder[]) => {
    setReminders(next);
    saveReminders(next);
  };


  const resetForm = () => {
    setTitle("");
    setTime("");
    setEditIndex(null);
  };

  const addReminder = () => {
    if (!title.trim() || !time.trim()) {
      toast.error("اكتبي التذكير والوقت");
      return;
    }
    if (editIndex !== null) {
      const next = reminders.map((r, i) => (i === editIndex ? { title: title.trim(), time: time.trim() } : r));
      save(next);
      toast.success("تم تعديل التذكير — هيتحدث في الرئيسية");
    } else {
      save([{ title: title.trim(), time: time.trim() }, ...reminders]);
      toast.success("تمت إضافة التذكير — هيظهر في الرئيسية");
    }
    resetForm();
  };

  const startEdit = (index: number) => {
    setTitle(reminders[index].title);
    setTime(reminders[index].time);
    setEditIndex(index);
  };

  const deleteReminder = (index: number) => {
    if (editIndex === index) resetForm();
    save(reminders.filter((_, i) => i !== index));
    toast.success("تم مسح التذكير");
  };

  return (
    <PhoneFrame variant="muted">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">التنبيهات</h1>
        <span className="icon-bubble w-10 h-10">
          <Bell size={18} />
        </span>
      </div>

      {/* Add / Edit form */}
      <div className="surface-card space-y-3">
        <div className="flex items-center justify-between">
          {editIndex !== null ? (
            <button
              onClick={resetForm}
              className="text-xs text-muted-foreground font-light active:scale-95 transition"
            >
              إلغاء التعديل
            </button>
          ) : (
            <span />
          )}
          <h3 className="section-title flex items-center gap-2 justify-end">
            <span>{editIndex !== null ? "تعديل التذكير" : "تذكير جديد"}</span>
            {editIndex !== null ? (
              <Pencil size={16} className="text-primary-deep" />
            ) : (
              <Plus size={16} className="text-primary-deep" />
            )}
          </h3>
        </div>
        <input
          className="field"
          placeholder="مثال: معاد دواء الضغط"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="time"
          className="field"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button className="brand-button" onClick={addReminder}>
          {editIndex !== null ? "حفظ التعديل" : "إضافة التذكير"}
        </button>
      </div>

      {/* List */}
      <div className="mt-5 space-y-3">
        {reminders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground font-light py-6">
            مفيش تذكيرات بعد — ضيفي أول تذكير فوق
          </p>
        )}
        {reminders.map((r, i) => (
          <div key={i} className={`surface-card flex items-center justify-between ${editIndex === i ? "ring-1 ring-primary/40" : ""}`}>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => deleteReminder(i)}
                aria-label="مسح التذكير"
                className="w-8 h-8 rounded-full inline-flex items-center justify-center text-red-500 bg-red-500/10 active:scale-95 transition tap-glow"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => (editIndex === i ? resetForm() : startEdit(i))}
                aria-label="تعديل التذكير"
                className={`w-8 h-8 rounded-full inline-flex items-center justify-center active:scale-95 transition tap-glow ${
                  editIndex === i ? "text-primary-deep bg-primary/15" : "text-primary-deep bg-primary/10"
                }`}
              >
                {editIndex === i ? <Check size={15} /> : <Pencil size={15} />}
              </button>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <h3 className="text-sm font-semibold">{r.title}</h3>
                <p className="text-xs text-muted-foreground font-light mt-0.5 flex items-center gap-1 justify-end">
                  <span>{r.time}</span>
                  <Clock size={11} />
                </p>
              </div>
              <span className="icon-bubble w-9 h-9 shrink-0">
                <Bell size={15} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
};

export default Alerts;
