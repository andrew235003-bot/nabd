import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Lock, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { setSignup } from "@/lib/storage";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("املأ كل البيانات");
      return;
    }
    if (form.password.length < 6) {
      toast.error("كلمة السر 6 أحرف على الأقل");
      return;
    }
    setSignup(form);
    navigate("/medical");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <PhoneFrame>
      <button onClick={() => navigate(-1)} className="self-start icon-bubble w-11 h-11" aria-label="رجوع">
        <ArrowLeft size={20} />
      </button>

      <div className="text-right mt-6">
        <h1 className="text-4xl font-extrabold">إنشاء حساب</h1>
        <p className="text-muted-foreground mt-2">أدخل بياناتك الأساسية</p>
        <div className="h-1.5 bg-secondary rounded-full mt-5 overflow-hidden">
          <div className="h-full w-1/2 rounded-full" style={{ background: "var(--gradient-primary)" }} />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5 mt-6 flex-1">
        <Field icon={<User size={20} />} placeholder="الاسم الكامل" value={form.name} onChange={set("name")} maxLength={60} />
        <Field icon={<Mail size={20} />} placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={set("email")} maxLength={120} />
        <Field icon={<Lock size={20} />} placeholder="كلمة السر" type="password" value={form.password} onChange={set("password")} maxLength={64} />
        <Field icon={<Phone size={20} />} placeholder="رقم الهاتف" type="tel" value={form.phone} onChange={set("phone")} maxLength={20} />

        <button type="submit" className="brand-button mt-4 inline-flex items-center justify-center gap-2">
          <ChevronLeft size={20} />
          <span>التالي</span>
        </button>
      </form>
    </PhoneFrame>
  );
};

const Field = ({
  icon, ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <input {...props} className="field pr-14" />
    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">{icon}</span>
  </div>
);

export default Signup;
