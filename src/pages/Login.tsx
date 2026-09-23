import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/PhoneFrame";
import { NabdLogo } from "@/components/NabdLogo";
import { setUser } from "@/lib/storage";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("من فضلك أدخل البريد وكلمة السر");
      return;
    }
    setUser({ email });
    toast.success("تم تسجيل الدخول");
    navigate("/home");
  };

  return (
    <PhoneFrame>
      <button onClick={() => navigate(-1)} className="self-start icon-bubble w-11 h-11" aria-label="رجوع">
        <ArrowLeft size={20} />
      </button>

      <div className="flex flex-col items-center text-center mt-6 mb-8">
        <NabdLogo size={56} />
        <h1 className="text-3xl font-extrabold mt-4">تسجيل الدخول</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 flex-1">
        <div className="relative">
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="field pr-14"
            maxLength={120}
          />
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
        </div>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر"
            className="field pr-14"
            maxLength={64}
          />
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
        </div>
        <button type="submit" className="brand-button mt-2">دخول</button>
        <p className="text-center text-muted-foreground pt-3">
          ليس لديك حساب؟{" "}
          <Link to="/signup" className="text-primary-deep font-bold">سجّل الآن</Link>
        </p>
      </form>
    </PhoneFrame>
  );
};

export default Login;
