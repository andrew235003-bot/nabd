export type Reminder = { title: string; time: string };

const KEY = "nabd_reminders";

const DEFAULT_REMINDERS: Reminder[] = [
  { title: "دواء الضغط", time: "20:00" },
  { title: "موعد فحص دوري", time: "09:00" },
];

export const loadReminders = (): Reminder[] => {
  const saved = localStorage.getItem(KEY);
  if (saved === null) {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_REMINDERS));
    return DEFAULT_REMINDERS;
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveReminders = (next: Reminder[]) => {
  localStorage.setItem(KEY, JSON.stringify(next));
};
