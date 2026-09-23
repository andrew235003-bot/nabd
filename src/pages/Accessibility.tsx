import { ArrowRight, ChevronLeft, Mic, PenLine, Camera as CameraIcon, Square, BookOpen, Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";
import { readImageText } from "@/lib/api";

type Mode = "menu" | "voice" | "write" | "read";

const isMode = (v: string | null): v is Mode =>
  v === "menu" || v === "voice" || v === "write" || v === "read";

const Accessibility = () => {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<Mode>(isMode(modeParam) ? modeParam : "menu");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const recRef = useRef<any>(null);

  // keep the mode in sync with the ?mode= param (voice navigation)
  useEffect(() => {
    if (isMode(modeParam)) setMode(modeParam);
    else setMode("menu");
  }, [modeParam]);



  // Camera (write-in-air + book reading)
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [recognized, setRecognized] = useState("");

  // Book reading
  const [shot, setShot] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [bookText, setBookText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  // ---- Speech recognition ----
  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("المتصفح لا يدعم التعرف على الصوت");
      return;
    }
    const r = new SR();
    r.lang = "ar-EG";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e: any) => {
      let finalT = "";
      let interimT = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalT += t + " ";
        else interimT += t;
      }
      if (finalT) setTranscript((prev) => (prev + " " + finalT).trim());
      setInterim(interimT);
    };
    r.onerror = () => { setListening(false); };
    r.onend = () => setListening(false);
    recRef.current = r;
    r.start();
    setListening(true);
  };

  const stopListening = () => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
    setInterim("");
  };

  // ---- Camera ----
  const startCamera = async (facing: "user" | "environment" = "user") => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setCamOn(true);
    } catch {
      toast.error("تعذر فتح الكاميرا");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamOn(false);
  };

  // ---- Text to speech ----
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("المتصفح لا يدعم تشغيل الصوت");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-EG";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const togglePlay = () => {
    if (!bookText) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      speak(bookText);
    }
  };

  // ---- Capture + send to model ----
  const captureAndRead = async () => {
    const video = videoRef.current;
    if (!video || !camOn) {
      toast.error("شغّل الكاميرا الأول");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setShot(dataUrl);
    setBookText("");
    setReading(true);
    try {
      const data = await readImageText(dataUrl, "image/jpeg");
      const text = (data?.text || "").trim();
      if (!text) throw new Error("empty");
      setBookText(text);
      speak(text);
    } catch {
      toast.error("تعذر الاتصال بخدمة القراءة — تأكد أن السيرفر شغال");
    } finally {
      setReading(false);
    }
  };

  useEffect(() => {
    return () => {
      try { recRef.current?.stop(); } catch {}
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const openMode = (m: Mode) => {
    setMode(m);
    setSearchParams(m === "menu" ? {} : { mode: m });
  };

  const back = () => {
    stopListening();
    stopCamera();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    setTranscript("");
    setRecognized("");
    setShot(null);
    setBookText("");
    openMode("menu");
  };

  return (
    <PhoneFrame variant="muted">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => (mode === "menu" ? nav("/home") : back())} className="icon-bubble tap-glow w-10 h-10">
          <ArrowRight size={18} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">وضع ذوي الهمم</h1>
        <div className="w-10" />
      </div>

      {mode === "menu" && (
        <>
          <p className="text-center text-xs text-muted-foreground font-light mb-5 px-4">
            اختر طريقة التواصل المناسبة لك
          </p>

          <div className="flex flex-col gap-3">
            {/* Voice → Text */}
            <button
              onClick={() => openMode("voice")}
              className="surface-card w-full flex items-center gap-3.5 text-right transition-all active:scale-[.98] hover:border-primary/40"
            >
              <span className="w-11 h-11 rounded-xl icon-bubble shrink-0">
                <Mic size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold">تحويل الصوت إلى نص</h3>
                <p className="text-[11px] font-light text-muted-foreground mt-0.5 leading-relaxed">
                  استمع لمن حولك واقرأ كلامهم نصاً
                </p>
              </div>
              <ChevronLeft size={18} className="text-muted-foreground/60 shrink-0" />
            </button>

            {/* Write-in-air */}
            <button
              onClick={() => openMode("write")}
              className="surface-card w-full flex items-center gap-3.5 text-right transition-all active:scale-[.98] hover:border-primary/40"
            >
              <span className="w-11 h-11 rounded-xl icon-bubble shrink-0">
                <PenLine size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold">الكتابة في الهواء</h3>
                <p className="text-[11px] font-light text-muted-foreground mt-0.5 leading-relaxed">
                  اكتب بإصبعك في الهواء وسيظهر النص
                </p>
              </div>
              <ChevronLeft size={18} className="text-muted-foreground/60 shrink-0" />
            </button>

            {/* Book reading */}
            <button
              onClick={() => openMode("read")}
              className="surface-card w-full flex items-center gap-3.5 text-right transition-all active:scale-[.98] hover:border-primary/40"
            >
              <span className="w-11 h-11 rounded-xl icon-bubble shrink-0">
                <BookOpen size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold">قراءة الكتب</h3>
                <p className="text-[11px] font-light text-muted-foreground mt-0.5 leading-relaxed">
                  صوّر الصفحة ويقرأها لك التطبيق صوتياً
                </p>
              </div>
              <ChevronLeft size={18} className="text-muted-foreground/60 shrink-0" />
            </button>
          </div>
        </>
      )}

      {mode === "voice" && (
        <div className="flex flex-col items-center">
          <div className="surface-card w-full min-h-[260px] text-right">
            <span className="muted-label">النص المسموع</span>
            <p className="text-base leading-loose mt-2 whitespace-pre-wrap">
              {transcript || <span className="text-muted-foreground font-light">اضغط على الميكروفون وابدأ الاستماع…</span>}
              {interim && <span className="text-muted-foreground"> {interim}</span>}
            </p>
          </div>

          <button
            onClick={listening ? stopListening : startListening}
            className={`mt-8 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-[var(--shadow-button)] transition-all ${listening ? "animate-pulse" : ""}`}
            style={{
              background: listening
                ? "linear-gradient(135deg, hsl(0 75% 70%), hsl(0 70% 55%))"
                : "linear-gradient(135deg, hsl(200 90% 75%), hsl(208 80% 55%))",
            }}
          >
            {listening ? <Square size={28} fill="white" /> : <Mic size={32} />}
          </button>
          <p className="text-xs text-muted-foreground font-light mt-3">
            {listening ? "جاري الاستماع… اضغط للإيقاف" : "اضغط للبدء"}
          </p>
          {transcript && (
            <button onClick={() => setTranscript("")} className="ghost-button mt-4 w-auto px-6">
              مسح النص
            </button>
          )}
        </div>
      )}

      {mode === "write" && (
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden bg-black relative shadow-[var(--shadow-card)]">
            {camOn ? (
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                <CameraIcon size={40} />
                <p className="text-xs font-light mt-3">الكاميرا مغلقة</p>
              </div>
            )}
            {camOn && (
              <div className="absolute top-3 left-3 right-3 bg-black/50 backdrop-blur rounded-xl px-3 py-2 text-white text-xs text-center font-light">
                اكتب الحروف في الهواء بإصبعك
              </div>
            )}
          </div>

          <div className="surface-card w-full mt-4 text-right min-h-[80px]">
            <span className="muted-label">النص المُتعرَّف عليه</span>
            <p className="text-base leading-loose mt-1">
              {recognized || (
                <span className="text-muted-foreground font-light text-xs">
                  سيظهر النص هنا فور ربط نموذج الذكاء الاصطناعي…
                </span>
              )}
            </p>
          </div>

          <button
            onClick={camOn ? stopCamera : () => startCamera("user")}
            className="mt-4 w-full brand-button"
            style={{
              background: camOn
                ? "linear-gradient(135deg, hsl(0 75% 70%), hsl(0 70% 55%))"
                : "linear-gradient(135deg, hsl(200 90% 75%), hsl(208 80% 55%))",
            }}
          >
            {camOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
          </button>
        </div>
      )}

      {mode === "read" && (
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden bg-black relative shadow-[var(--shadow-card)]">
            {shot && !camOn ? (
              <img src={shot} alt="الصفحة الملتقطة" className="w-full h-full object-cover" />
            ) : camOn ? (
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                <BookOpen size={40} />
                <p className="text-xs font-light mt-3">شغّل الكاميرا ووجّهها على الصفحة</p>
              </div>
            )}
            {camOn && (
              <div className="absolute top-3 left-3 right-3 bg-black/50 backdrop-blur rounded-xl px-3 py-2 text-white text-xs text-center font-light">
                وجّه الكاميرا على صفحة الكتاب ثم اضغط «التقط واقرأ»
              </div>
            )}
            {reading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3">
                <Loader2 size={34} className="animate-spin" />
                <p className="text-xs font-light">جاري قراءة الصورة…</p>
              </div>
            )}
          </div>

          <button
            onClick={camOn ? stopCamera : () => startCamera("environment")}
            className="mt-4 w-full brand-button"
            style={{
              background: camOn
                ? "linear-gradient(135deg, hsl(0 75% 70%), hsl(0 70% 55%))"
                : "linear-gradient(135deg, hsl(188 75% 72%), hsl(196 68% 52%))",
            }}
          >
            {camOn ? "إيقاف الكاميرا" : "تشغيل الكاميرا"}
          </button>

          <button
            onClick={captureAndRead}
            disabled={!camOn || reading}
            className="mt-3 w-full ghost-button disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <CameraIcon size={16} /> التقط واقرأ
            </span>
          </button>

          {/* Audio player */}
          <div className="surface-card w-full mt-4 text-right">
            <span className="muted-label">التسجيل الصوتي للصفحة</span>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={togglePlay}
                disabled={!bookText}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0 shadow-[var(--shadow-button)] disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, hsl(188 75% 72%), hsl(196 68% 52%))" }}
              >
                {speaking ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <button
                onClick={() => bookText && speak(bookText)}
                disabled={!bookText}
                className="w-11 h-11 rounded-full icon-bubble tap-glow disabled:opacity-40"
                aria-label="إعادة"
              >
                <RotateCcw size={16} />
              </button>
              <p className="text-xs text-muted-foreground font-light flex-1">
                {bookText
                  ? speaking
                    ? "جاري تشغيل الصوت…"
                    : "اضغط للاستماع لنص الصفحة"
                  : "التقط صورة للصفحة لتوليد الصوت"}
              </p>
            </div>
          </div>

          {bookText && (
            <div className="surface-card w-full mt-4 text-right">
              <span className="muted-label">النص المقروء</span>
              <p className="text-sm leading-loose mt-2 whitespace-pre-wrap">{bookText}</p>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
};

export default Accessibility;
