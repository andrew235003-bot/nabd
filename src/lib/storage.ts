// طبقة تخزين موحّدة لكل بيانات المستخدم المحفوظة محلياً (localStorage).
//
// ليه الملف ده؟ عشان لو حبينا نستبدل localStorage بباك اند حقيقي بعد كده،
// التعديل هيكون هنا بس (في الدوال دي) بدل ما نلف على كل الصفحات ونعدلها واحدة واحدة.
// كل صفحة المفروض تستورد من هنا بدل ما تنادي localStorage.getItem/setItem مباشرة.

export type SignupData = {
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};

export type MedicalData = {
  age?: number;
  blood?: string;
  chronicCount?: number;
  [key: string]: unknown;
};

export type UserData = {
  email?: string;
  [key: string]: unknown;
};

export type MedicalRecord = {
  title: string;
  part: string;
  date: string;
  level: "green" | "yellow" | "red";
};

export type AssistantQueueItem = {
  from: "bot" | "me";
  text: string;
  ts?: number;
};

const KEYS = {
  user: "nabd_user",
  signup: "nabd_signup",
  medical: "nabd_medical",
  records: "nabd_records",
  assistantQueue: "nabd_assistant_queue",
  lastLevel: "nabd_last_level",
  theme: "nabd_theme",
  lang: "nabd_lang",
} as const;

// قراءة/كتابة JSON بشكل آمن (مع fallback لو البيانات باظت أو مش موجودة)
function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- المستخدم (بيانات تسجيل الدخول) ----
export const getUser = (): UserData => readJson(KEYS.user, {});
export const setUser = (data: UserData): void => writeJson(KEYS.user, data);
export const clearUser = (): void => localStorage.removeItem(KEYS.user);

// ---- بيانات إنشاء الحساب ----
export const getSignup = (): SignupData => readJson(KEYS.signup, {});
export const setSignup = (data: SignupData): void => writeJson(KEYS.signup, data);

// ---- البيانات الطبية (فصيلة الدم، العمر، الأمراض المزمنة...) ----
export const getMedical = (): MedicalData => readJson(KEYS.medical, {});
export const setMedical = (data: MedicalData): void => writeJson(KEYS.medical, data);
export const updateMedical = (patch: Partial<MedicalData>): MedicalData => {
  const next = { ...getMedical(), ...patch };
  setMedical(next);
  return next;
};

// ---- السجلات الطبية المرفوعة ----
export const getRecords = (): MedicalRecord[] | null => {
  const raw = localStorage.getItem(KEYS.records);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as MedicalRecord[];
  } catch {
    return null;
  }
};
export const setRecords = (records: MedicalRecord[]): void => writeJson(KEYS.records, records);

// ---- طابور رسائل المساعد (يُكتب من صفحة المتابعة، ويُقرأ ويُمسح من صفحة المساعد) ----
export const setAssistantQueue = (queue: AssistantQueueItem[]): void => writeJson(KEYS.assistantQueue, queue);

// إضافة رسالة واحدة لآخر الطابور (بيقرا الموجود ويضيف عليه)
export const pushToAssistantQueue = (item: AssistantQueueItem): void => {
  try {
    const queue = JSON.parse(localStorage.getItem(KEYS.assistantQueue) || "[]");
    queue.push(item);
    writeJson(KEYS.assistantQueue, queue);
  } catch {
    writeJson(KEYS.assistantQueue, [item]);
  }
};

// بترجع الطابور وتمسحه فوراً (نفس السلوك القديم: يتقرا مرة واحدة بس)
export const popAssistantQueue = (): AssistantQueueItem[] => {
  try {
    const queue = JSON.parse(localStorage.getItem(KEYS.assistantQueue) || "[]");
    if (Array.isArray(queue) && queue.length) {
      localStorage.removeItem(KEYS.assistantQueue);
      return queue;
    }
  } catch {
    /* ignore malformed queue data */
  }
  return [];
};

// ---- آخر مستوى إصابة تم تسجيله ----
export const getLastLevel = (): number => Number(localStorage.getItem(KEYS.lastLevel) || "0");
export const setLastLevel = (level: number): void => localStorage.setItem(KEYS.lastLevel, String(level));

// ---- التفضيلات (الوضع الليلي واللغة) ----
export const getTheme = (): "dark" | "light" | null =>
  (localStorage.getItem(KEYS.theme) as "dark" | "light" | null);
export const setTheme = (theme: "dark" | "light"): void => localStorage.setItem(KEYS.theme, theme);

export const getLang = (): "AR" | "EN" | null => (localStorage.getItem(KEYS.lang) as "AR" | "EN" | null);
export const setLang = (lang: "AR" | "EN"): void => localStorage.setItem(KEYS.lang, lang);
