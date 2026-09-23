import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WAKE_WORD_TIMEOUT_MS } from "@/lib/voice/commandRegistry";
import { detectWakeWord, matchVoiceCommand } from "@/lib/voice/matchVoiceCommand";

export type VoiceState =
  | "OFF"
  | "LISTENING"
  | "WAKE_WORD_DETECTED"
  | "PROCESSING_COMMAND"
  | "EXECUTING"
  | "ERROR";

const getSpeechRecognition = (): any =>
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const isVoiceSupported = () =>
  typeof window !== "undefined" && Boolean(getSpeechRecognition());

/**
 * Voice navigation with the "نبض" wake word.
 * Works only while the tab is open and visible — browsers suspend
 * recognition in the background; we pause and resume accordingly.
 */
export const useVoiceNavigation = () => {
  const navigate = useNavigate();
  const supported = isVoiceSupported();

  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<VoiceState>("OFF");
  const [lastCommand, setLastCommand] = useState<string>("");

  const recRef = useRef<any>(null);
  const enabledRef = useRef(false);
  const runningRef = useRef(false);
  const awakeRef = useRef(false);
  const wakeTimerRef = useRef<number | null>(null);
  const lastExecRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  const clearWakeTimer = () => {
    if (wakeTimerRef.current) {
      window.clearTimeout(wakeTimerRef.current);
      wakeTimerRef.current = null;
    }
  };

  const backToListening = useCallback(() => {
    awakeRef.current = false;
    clearWakeTimer();
    if (enabledRef.current) setState("LISTENING");
  }, []);

  const armWakeTimeout = useCallback(() => {
    clearWakeTimer();
    wakeTimerRef.current = window.setTimeout(backToListening, WAKE_WORD_TIMEOUT_MS);
  }, [backToListening]);

  const executeCommand = useCallback(
    (phrase: string) => {
      const now = Date.now();
      // duplicate-command protection
      if (lastExecRef.current.text === phrase && now - lastExecRef.current.at < 2500) return;

      setState("PROCESSING_COMMAND");
      const match = matchVoiceCommand(phrase);
      if (!match) {
        setState("ERROR");
        toast.error("لم أفهم الأمر، حاول مرة أخرى.");
        window.setTimeout(backToListening, 1400);
        return;
      }

      lastExecRef.current = { text: phrase, at: now };
      setLastCommand(match.command.name);
      setState("EXECUTING");

      if (match.command.type === "navigation") {
        navigate(match.command.target);
      } else {
        const top = match.command.target === "top" ? 0 : document.body.scrollHeight;
        window.scrollTo({ top, behavior: "smooth" });
      }
      window.setTimeout(backToListening, 900);
    },
    [backToListening, navigate],
  );

  const handleTranscript = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      if (!awakeRef.current) {
        const { detected, rest } = detectWakeWord(text);
        if (!detected) return;
        awakeRef.current = true;
        setState("WAKE_WORD_DETECTED");
        if (rest) {
          executeCommand(rest);
        } else {
          armWakeTimeout();
        }
        return;
      }

      const { detected, rest } = detectWakeWord(text);
      executeCommand(detected ? rest || text : text);
    },
    [armWakeTimeout, executeCommand],
  );

  const startRecognition = useCallback(() => {
    if (!supported || runningRef.current || !enabledRef.current) return;
    if (document.visibilityState !== "visible") return;

    const SR = getSpeechRecognition();
    const rec = new SR();
    rec.lang = "ar-EG";
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      runningRef.current = true;
      if (!awakeRef.current) setState("LISTENING");
    };
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) handleTranscript(e.results[i][0].transcript);
      }
    };
    rec.onerror = (e: any) => {
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        enabledRef.current = false;
        setEnabled(false);
        setState("ERROR");
        toast.error("لم يتم السماح باستخدام الميكروفون");
      }
    };
    rec.onend = () => {
      runningRef.current = false;
      if (enabledRef.current && document.visibilityState === "visible") {
        window.setTimeout(() => startRecognition(), 400);
      } else if (!enabledRef.current) {
        setState("OFF");
      }
    };

    try {
      rec.start();
      recRef.current = rec;
    } catch {
      runningRef.current = false;
    }
  }, [handleTranscript, supported]);

  const stopRecognition = useCallback(() => {
    clearWakeTimer();
    awakeRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    recRef.current = null;
    runningRef.current = false;
  }, []);

  const toggle = useCallback(() => {
    if (!supported) {
      toast.error("متصفحك لا يدعم التحكم الصوتي — جرّب Chrome على أندرويد أو الكمبيوتر");
      return;
    }
    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      stopRecognition();
      setState("OFF");
    } else {
      enabledRef.current = true;
      setEnabled(true);
      setState("LISTENING");
      startRecognition();
    }
  }, [startRecognition, stopRecognition, supported]);

  // pause when tab is hidden, resume when visible again
  useEffect(() => {
    const onVisibility = () => {
      if (!enabledRef.current) return;
      if (document.visibilityState === "visible") startRecognition();
      else stopRecognition();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [startRecognition, stopRecognition]);

  useEffect(
    () => () => {
      enabledRef.current = false;
      stopRecognition();
    },
    [stopRecognition],
  );

  return { supported, enabled, state, lastCommand, toggle };
};
