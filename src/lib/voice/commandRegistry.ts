/**
 * Central registry of voice destinations.
 * Only routes/sections that actually exist in the app are listed here.
 * To add a destination later: append one entry.
 */
export type VoiceCommand =
  | {
      id: string;
      type: "navigation";
      target: string; // existing route path
      name: string; // primary Arabic name
      aliases: string[]; // Arabic + English keywords
    }
  | {
      id: string;
      type: "scroll";
      target: "top" | "bottom";
      name: string;
      aliases: string[];
    };

export const VOICE_WAKE_WORD = "نبض";

/** Time (ms) we keep listening for a command after the wake word. */
export const WAKE_WORD_TIMEOUT_MS = 6000;

export const voiceCommandRegistry: VoiceCommand[] = [
  {
    id: "home",
    type: "navigation",
    target: "/home",
    name: "الرئيسية",
    aliases: ["الرئيسيه", "الصفحه الرئيسيه", "هوم", "البدايه", "home"],
  },
  {
    id: "records",
    type: "navigation",
    target: "/records",
    name: "السجل الطبي",
    aliases: ["السجل", "سجلي", "الملف الطبي", "records", "history"],
  },
  {
    id: "blood-bank",
    type: "navigation",
    target: "/blood-bank",
    name: "بنك الدم",
    aliases: ["بنك دم", "الدم", "التبرع بالدم", "blood bank", "blood"],
  },
  {
    id: "lab",
    type: "navigation",
    target: "/lab",
    name: "المعمل",
    aliases: ["معمل", "التحاليل", "تحاليل", "معمل تحاليل", "lab"],
  },
  {
    id: "assistant",
    type: "navigation",
    target: "/assistant",
    name: "المساعد الطبي",
    aliases: ["المساعد", "الشات", "الشات الطبي", "شات طبي", "assistant", "chat"],
  },
  {
    id: "follow-up",
    type: "navigation",
    target: "/follow-up",
    name: "المتابعة",
    aliases: ["المتابعه", "متابعه", "متابعة الاصابه", "follow up"],
  },
  {
    id: "scan",
    type: "navigation",
    target: "/scan",
    name: "المسح الضوئي",
    aliases: ["المسح", "الماسح", "تحليل الصوره", "الكاميرا", "scan"],
  },
  {
    id: "hospital",
    type: "navigation",
    target: "/hospital",
    name: "أقرب مستشفى",
    aliases: ["المستشفي", "مستشفي", "اقرب مستشفي", "hospital"],
  },
  {
    id: "pharmacy",
    type: "navigation",
    target: "/pharmacy",
    name: "أقرب صيدلية",
    aliases: ["الصيدليه", "صيدليه", "اقرب صيدليه", "pharmacy"],
  },
  {
    id: "first-aid",
    type: "navigation",
    target: "/first-aid",
    name: "الإسعافات الأولية",
    aliases: ["الاسعافات", "اسعافات اوليه", "الاسعافات الاوليه", "first aid"],
  },
  {
    id: "medical-report",
    type: "navigation",
    target: "/medical-report",
    name: "التقرير الطبي",
    aliases: ["التقرير", "تقرير طبي", "report"],
  },
  {
    id: "accessibility",
    type: "navigation",
    target: "/accessibility",
    name: "وضع ذوي الهمم",
    aliases: ["ذوي الهمم", "المعاقين", "وضع المعاقين", "accessibility"],
  },
  {
    id: "accessibility-voice",
    type: "navigation",
    target: "/accessibility?mode=voice",
    name: "تحويل الصوت إلى نص",
    aliases: [
      "الصوت الي نص",
      "تحويل الصوت الي نص",
      "صوت الي نص",
      "الميكروفون",
      "وضع الصم",
      "speech to text",
      "voice to text",
    ],
  },
  {
    id: "accessibility-write",
    type: "navigation",
    target: "/accessibility?mode=write",
    name: "الكتابة في الهواء",
    aliases: [
      "الكتابه في الهواء",
      "كتابه في الهواء",
      "الكتابه بالهواء",
      "اكتب في الهواء",
      "القلم",
      "air writing",
      "write in air",
    ],
  },
  {
    id: "accessibility-read",
    type: "navigation",
    target: "/accessibility?mode=read",
    name: "قراءة الكتب",
    aliases: [
      "قراءه الكتب",
      "قراءة كتاب",
      "اقرا الكتاب",
      "اقرا لي",
      "قراءه الصفحه",
      "book reading",
      "read book",
    ],
  },

  {
    id: "medical",
    type: "navigation",
    target: "/medical",
    name: "البيانات الطبية",
    aliases: ["بياناتي الطبيه", "البيانات الطبيه", "medical data"],
  },
  {
    id: "alerts",
    type: "navigation",
    target: "/alerts",
    name: "التنبيهات",
    aliases: ["تنبيهات", "التذكيرات", "تذكيراتي", "الاشعارات", "alerts", "reminders"],
  },
  {
    id: "information",
    type: "navigation",
    target: "/information",
    name: "معلومات",
    aliases: ["المعلومات", "معلومات الادويه", "اضرار الادويه", "information", "info"],
  },
  {
    id: "welcome",
    type: "navigation",
    target: "/welcome",
    name: "شاشة الترحيب",
    aliases: ["الترحيب", "welcome"],
  },
  {
    id: "login",
    type: "navigation",
    target: "/login",
    name: "تسجيل الدخول",
    aliases: ["الدخول", "لوجن", "login", "sign in"],
  },
  {
    id: "signup",
    type: "navigation",
    target: "/signup",
    name: "إنشاء حساب",
    aliases: ["حساب جديد", "التسجيل", "signup", "register"],
  },
  {
    id: "scroll-top",
    type: "scroll",
    target: "top",
    name: "أعلى الصفحة",
    aliases: ["فوق", "اعلي الصفحه", "لفوق", "top", "scroll up"],
  },
  {
    id: "scroll-bottom",
    type: "scroll",
    target: "bottom",
    name: "أسفل الصفحة",
    aliases: ["تحت", "اسفل الصفحه", "لتحت", "bottom", "scroll down"],
  },
];
