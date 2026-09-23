import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, ChevronLeft, HelpCircle, LogOut, Menu, Settings, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { getUser, getSignup, clearUser } from "@/lib/storage";

export const SideMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const stored = getUser();
  const sup = getSignup();

  const items = [
    { icon: <User size={18} />, label: "الملف الشخصي", onClick: () => toast("الملف الشخصي") },
    { icon: <Settings size={18} />, label: "الإعدادات", onClick: () => toast("الإعدادات") },
    { icon: <Bell size={18} />, label: "التنبيهات", onClick: () => toast("التنبيهات") },
    { icon: <Shield size={18} />, label: "الخصوصية والأمان", onClick: () => toast("الخصوصية") },
    { icon: <HelpCircle size={18} />, label: "المساعدة والدعم", onClick: () => toast("الدعم") },
  ];

  const onLogout = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("من فضلك أدخل البريد وكلمة السر");
      return;
    }
    if (stored.email && email !== stored.email) {
      toast.error("البريد غير صحيح");
      return;
    }
    clearUser();
    toast.success("تم تسجيل الخروج");
    setLogoutOpen(false);
    setOpen(false);
    setTimeout(() => navigate("/login"), 400);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="icon-bubble tap-glow w-10 h-10" aria-label="القائمة">
          <Menu size={18} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[78%] max-w-[340px] bg-muted/70 backdrop-blur border-l border-border p-0 flex flex-col">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border/60 bg-card">
          <SheetTitle className="text-right">
            <div className="flex items-center gap-3 justify-end">
              <div className="text-right">
                <p className="text-sm font-semibold">{sup.name || "مستخدم نبض"}</p>
                <p className="text-xs font-light text-muted-foreground">{stored.email || sup.email || "—"}</p>
              </div>
              <span className="w-11 h-11 rounded-full text-white flex items-center justify-center text-sm font-medium" style={{ background: "var(--gradient-primary)" }}>
                {(sup.name || "ن").charAt(0)}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {!logoutOpen ? (
          <div className="flex-1 overflow-y-auto p-3">
            {items.map((it) => (
              <button
                key={it.label}
                onClick={it.onClick}
                className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-card transition text-right"
              >
                <ChevronLeft size={16} className="text-muted-foreground" />
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="text-sm font-medium">{it.label}</span>
                  <span className="icon-bubble w-9 h-9">{it.icon}</span>
                </div>
              </button>
            ))}

            <div className="h-px bg-border/60 my-3" />

            <button
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-card transition text-right"
            >
              <ChevronLeft size={16} className="text-destructive/70" />
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-sm font-medium text-destructive">تسجيل الخروج</span>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-destructive/10 text-destructive">
                  <LogOut size={18} />
                </span>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={onLogout} className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="text-right">
              <h3 className="text-base font-semibold">تأكيد تسجيل الخروج</h3>
              <p className="text-xs text-muted-foreground font-light mt-1">أدخل بياناتك للتأكيد</p>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              className="field"
            />
            <button type="submit" className="brand-button" style={{ background: "linear-gradient(135deg, hsl(0 75% 78%), hsl(0 70% 65%))" }}>
              خروج من الحساب
            </button>
            <button type="button" onClick={() => setLogoutOpen(false)} className="ghost-button">
              إلغاء
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
