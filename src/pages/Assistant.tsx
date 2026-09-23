import { ArrowRight, Mic, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { popAssistantQueue } from "@/lib/storage";

type Msg = { from: "bot" | "me"; text: string };

const suggestions = ["كيف أوقف النزيف؟", "ما علاج الحروق؟", "متى أذهب للمستشفى؟"];

const Assistant = () => {
  const nav = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(() => {
    const base: Msg[] = [{ from: "bot", text: "أهلاً! أنا مساعد نبض الطبي. كيف يمكنني مساعدتك؟ 💙" }];
    const queue = popAssistantQueue();
    if (queue.length) {
      return [...base, ...queue.map((q) => ({ from: "bot" as const, text: q.text }))];
    }
    return base;
  });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const t = setInterval(() => {
      const queue = popAssistantQueue();
      if (queue.length) {
        setMessages((m) => [...m, ...queue.map((q) => ({ from: "bot" as const, text: q.text }))]);
      }
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "me", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: "تم استلام سؤالك، سأساعدك فوراً 💙" }]);
    }, 600);
  };

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => nav("/home")} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">المساعد الطبي</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-3 pb-40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              m.from === "me" ? "bg-primary text-white" : "bg-card shadow-[var(--shadow-card)]"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-full max-w-[440px] px-4 z-40">
        <div className="flex gap-2 overflow-x-auto pb-3 nav-scroll">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="shrink-0 px-4 py-2 rounded-full bg-card border border-border text-sm">
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-card rounded-2xl p-2 shadow-[var(--shadow-card)]">
          <button className="w-11 h-11 rounded-2xl text-white flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Mic size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="اكتب سؤالك..."
            className="flex-1 bg-transparent outline-none text-right px-2"
          />
          <button onClick={() => send(input)} className="w-10 h-10 rounded-full text-primary-deep bg-primary/15 flex items-center justify-center">
            <Send size={16} />
          </button>
        </div>
      </div>

      <BottomNav />
    </PhoneFrame>
  );
};

export default Assistant;
