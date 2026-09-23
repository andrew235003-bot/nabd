import { Mic, MicOff, Loader2, Check, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useVoiceNavigation, VoiceState } from "@/hooks/useVoiceNavigation";

const hints: Record<VoiceState, string> = {
  OFF: "التحكم الصوتي مغلق",
  LISTENING: "قل «نبض» للبدء",
  WAKE_WORD_DETECTED: "اسمعك… قول الأمر",
  PROCESSING_COMMAND: "جاري الفهم…",
  EXECUTING: "تمام",
  ERROR: "حصلت مشكلة",
};

const POS_KEY = "nabd-voice-indicator-pos";
const BTN = 48; // button size px
const MARGIN = 8;

type Pos = { x: number; y: number };
type Bounds = { left: number; right: number; top: number; bottom: number };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

// حدود الحركة = حدود "الاسكرينة" الظاهرة على الشاشة (.phone-frame)، مش حدود المتصفح كله
// عشان الكورة متخرجش برة تصميم الشاشة على اللابتوب والتابلت
const getFrameBounds = (): Bounds => {
  const el = document.querySelector<HTMLElement>(".phone-frame");
  if (el) {
    const r = el.getBoundingClientRect();
    return {
      left: r.left + MARGIN,
      right: r.right - MARGIN,
      top: r.top + MARGIN,
      bottom: r.bottom - MARGIN,
    };
  }
  return { left: MARGIN, right: window.innerWidth - MARGIN, top: MARGIN, bottom: window.innerHeight - MARGIN };
};

const clampToBounds = (p: Pos, b: Bounds): Pos => ({
  x: clamp(p.x, b.left, b.right - BTN),
  y: clamp(p.y, b.top, b.bottom - BTN),
});

const defaultPos = (): Pos => {
  const b = getFrameBounds();
  return { x: b.left + 8, y: b.bottom - 96 - BTN }; // above bottom nav, inside the frame
};

const loadPos = (): Pos => {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.x === "number" && typeof p.y === "number") return clampToBounds(p, getFrameBounds());
    }
  } catch {}
  return defaultPos();
};

export const VoiceIndicator = () => {
  const { supported, enabled, state, lastCommand, toggle } = useVoiceNavigation();
  const { pathname } = useLocation();

  const [pos, setPos] = useState<Pos>(loadPos);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null);

  // keep inside the phone-frame bounds on resize
  useEffect(() => {
    const onResize = () => setPos((p) => clampToBounds(p, getFrameBounds()));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // إعادة الحساب بعد ما الصفحة الجديدة تترندر (كل صفحة ممكن يكون ارتفاعها مختلف شوية)
  useEffect(() => {
    const t = window.setTimeout(() => setPos((p) => clampToBounds(p, getFrameBounds())), 50);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y, moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 6) return; // click threshold
    d.moved = true;
    setPos(clampToBounds({ x: d.baseX + dx, y: d.baseY + dy }, getFrameBounds()));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (d.moved) {
      try {
        localStorage.setItem(POS_KEY, JSON.stringify(pos));
      } catch {}
    } else {
      toggle();
    }
    e.preventDefault();
  };

  const icon = () => {
    if (!supported || (!enabled && state === "OFF")) return <MicOff size={18} />;
    if (state === "PROCESSING_COMMAND") return <Loader2 size={18} className="animate-spin" />;
    if (state === "EXECUTING") return <Check size={18} />;
    if (state === "ERROR") return <AlertCircle size={18} />;
    return <Mic size={18} />;
  };

  const active = enabled && state !== "OFF" && state !== "ERROR";
  const awake = state === "WAKE_WORD_DETECTED";

  return (
    <div className="fixed z-[60] pointer-events-none" style={{ left: pos.x, top: pos.y }}>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragRef.current = null)}
          aria-label="التحكم الصوتي — اسحب لتحريك الزر"
          style={{ touchAction: "none" }}
          className={`w-12 h-12 rounded-full flex items-center justify-center border border-border bg-card/95 backdrop-blur text-primary-deep transition-shadow duration-300 cursor-grab active:cursor-grabbing select-none ${
            active ? "shadow-[0_0_0_4px_hsl(var(--primary)/0.18),0_0_22px_hsl(var(--primary)/0.5)]" : "shadow-[var(--shadow-card)]"
          } ${awake ? "animate-pulse scale-105" : ""} ${state === "ERROR" ? "text-destructive" : ""}`}
        >
          {icon()}
        </button>
        {(enabled || state === "ERROR") && (
          <span className="text-[11px] font-light bg-card/95 backdrop-blur border border-border rounded-full px-3 py-1 text-muted-foreground whitespace-nowrap">
            {state === "EXECUTING" && lastCommand ? lastCommand : hints[state]}
          </span>
        )}
      </div>
    </div>
  );
};
