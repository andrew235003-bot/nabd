import { useEffect } from "react";
import { loadReminders } from "@/lib/reminders";

// كل ده بيشتغل بمتصفح المستخدم مباشرة (Web Notification API) — من غير أي سيرفر
// أو مفتاح API خارجي. المتصفح نفسه بيسأل "اسمحلي" (Allow) مرة واحدة، وبعدها
// بيقدر يبعت تنبيهات حقيقية للتليفون/الجهاز طول ما التطبيق مفتوح في تبويب.

const FIRED_KEY = "nabd_fired_reminders";

type FiredLog = { date: string; keys: string[] };

const loadFiredLog = (): FiredLog => {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { date: "", keys: [] };
};

const saveFiredLog = (log: FiredLog) => {
  localStorage.setItem(FIRED_KEY, JSON.stringify(log));
};

export const isNotificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getNotificationPermission = (): NotificationPermission | "unsupported" =>
  isNotificationSupported() ? Notification.permission : "unsupported";

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return "denied";
  return Notification.requestPermission();
};

// نغمة تنبيه بسيطة (بدون أي ملف صوت خارجي) عشان تحس إنه "منبه" فعلاً
const playAlarmBeep = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch {
    /* بعض المتصفحات بتمنع الصوت قبل أي تفاعل من المستخدم — مش مشكلة كبيرة */
  }
};

/**
 * بيفحص كل التذكيرات كل 20 ثانية، ولما وقت أي تذكير يوصل بيطلع Notification
 * حقيقي + رنة + اهتزاز (لو الجهاز بيدعمه). لازم يكون التطبيق مفتوح في تبويب
 * (حتى لو في الخلفية) عشان الفحص يشتغل — ده حد المتصفحات العادية.
 */
export const useReminderAlarms = () => {
  useEffect(() => {
    const check = () => {
      if (getNotificationPermission() !== "granted") return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;
      const today = now.toDateString();

      let log = loadFiredLog();
      if (log.date !== today) log = { date: today, keys: [] };

      const reminders = loadReminders();
      let changed = false;

      for (const r of reminders) {
        if (r.time !== currentTime) continue;
        const key = `${r.title}|${r.time}`;
        if (log.keys.includes(key)) continue;

        new Notification("⏰ تذكير من نبض", {
          body: r.title,
          icon: "/favicon.ico",
          tag: key,
        });
        playAlarmBeep();
        if (navigator.vibrate) navigator.vibrate([300, 150, 300]);

        log.keys.push(key);
        changed = true;
      }

      if (changed) saveFiredLog(log);
    };

    check();
    const interval = window.setInterval(check, 20_000);
    return () => window.clearInterval(interval);
  }, []);
};
