import { NavLink, useLocation } from "react-router-dom";
import { Accessibility as AccessibilityIcon, Bell, Droplet, FlaskConical, Heart, Home as HomeIcon, MessageCircle, ClipboardList, FileText } from "lucide-react";
import { ReactNode } from "react";

type Item = { to: string; icon: ReactNode; label: string };

const items: Item[] = [
  { to: "/home", icon: <HomeIcon size={20} />, label: "الرئيسية" },
  { to: "/records", icon: <FileText size={20} />, label: "السجل" },
  { to: "/blood-bank", icon: <Droplet size={20} />, label: "بنك دم" },
  { to: "/follow-up", icon: <ClipboardList size={20} />, label: "متابعة" },
  { to: "/lab", icon: <FlaskConical size={20} />, label: "معمل" },
  { to: "/accessibility", icon: <AccessibilityIcon size={20} />, label: "ذوي الهمم" },
  { to: "/assistant", icon: <MessageCircle size={20} />, label: "المساعد" },
  { to: "/alerts", icon: <Bell size={20} />, label: "تنبيهات" },
  { to: "/information", icon: <Heart size={20} />, label: "معلومات" },
];

export const BottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-card/95 backdrop-blur border-t border-border z-50">
      <div className="nav-scroll px-3 py-2">
        {items.map((it) => {
          const active = pathname === it.to;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className="shrink-0 flex flex-col items-center gap-1 px-2 py-1 min-w-[64px] text-muted-foreground"
            >
              <span
                className={`nav-glow inline-flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                  active ? "bg-primary/20 text-primary-deep shadow-[0_0_0_4px_hsl(var(--primary)/0.18),0_0_22px_hsl(var(--primary)/0.55)]" : ""
                }`}
              >
                {it.icon}
              </span>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-primary-deep" : ""}`}>
                {it.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
