import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Calendar, ChevronLeft, Droplet, FileText, Heart, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { setMedical } from "@/lib/storage";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Medical = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [blood, setBlood] = useState("");
  const [chronic, setChronic] = useState("");
  const [allergy, setAllergy] = useState("");
  const [history, setHistory] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!age || !blood) {
      toast.error("أدخل السن وفصيلة الدم على الأقل");
      return;
    }
    const chronicCount = chronic.split(/[,،]/).filter((s) => s.trim()).length;
    setMedical({
      age: Number(age), blood, chronic, allergy, history, chronicCount,
    });
    toast.success("تم حفظ بياناتك الطبية");
    navigate("/home");
  };

  return (
    <PhoneFrame>
      <button onClick={() => navigate(-1)} className="self-start icon-bubble w-11 h-11" aria-label="رجوع">
        <ArrowLeft size={20} />
      </button>

      <div className="text-right mt-4">
        <h1 className="text-3xl font-extrabold">البيانات الطبية</h1>
        <p className="text-muted-foreground mt-1">سجّل معلوماتك الصحية — مهمة للتقرير الطبي</p>
        <div className="h-1.5 bg-secondary rounded-full mt-4 overflow-hidden flex">
          <div className="h-full w-1/2" style={{ background: "var(--gradient-primary)" }} />
          <div className="h-full w-1/2" style={{ background: "var(--gradient-primary)" }} />
        </div>
      </div>

      <div className="surface-card mt-5 bg-accent/40 flex gap-3 items-start">
        <Lightbulb className="text-primary shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-foreground/80">
          هذه المعلومات ستُضاف تلقائياً للتقرير الطبي عند أي إصابة، حتى يعرف الطبيب تاريخك الصحي.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5 mt-5 flex-1 pb-4">
        <FieldWrap icon={<Calendar size={20} />}>
          <input
            inputMode="numeric"
            placeholder="السن"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
            className="field pr-14"
          />
        </FieldWrap>

        <FieldWrap icon={<Droplet size={20} />}>
          <select
            value={blood}
            onChange={(e) => setBlood(e.target.value)}
            className="field pr-14 appearance-none bg-card"
          >
            <option value="">فصيلة الدم</option>
            {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </FieldWrap>

        <FieldWrap icon={<Heart size={20} />}>
          <textarea
            placeholder="الأمراض المزمنة (مثل: سكري، ضغط، ربو...)"
            value={chronic}
            onChange={(e) => setChronic(e.target.value)}
            rows={2}
            maxLength={300}
            className="field pr-14 resize-none"
          />
        </FieldWrap>

        <FieldWrap icon={<AlertTriangle size={20} />}>
          <textarea
            placeholder="الحساسية (مثل: بنسلين، مسكنات...)"
            value={allergy}
            onChange={(e) => setAllergy(e.target.value)}
            rows={2}
            maxLength={300}
            className="field pr-14 resize-none"
          />
        </FieldWrap>

        <FieldWrap icon={<FileText size={20} />}>
          <textarea
            placeholder="نبذة عن تاريخك المرضي (عمليات سابقة، إصابات قديمة...)"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows={3}
            maxLength={500}
            className="field pr-14 resize-none"
          />
        </FieldWrap>

        <button type="submit" className="brand-button mt-2 inline-flex items-center justify-center gap-2">
          <ChevronLeft size={20} />
          <span>التالي</span>
        </button>
      </form>
    </PhoneFrame>
  );
};

const FieldWrap = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <span className="absolute right-auto left-5 top-4 text-primary">{icon}</span>
  </div>
);

export default Medical;
