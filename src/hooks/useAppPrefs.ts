import { useEffect, useState, useCallback } from "react";
import { getTheme, setTheme as saveTheme, getLang as getStoredLang, setLang as saveLang } from "@/lib/storage";

export type Lang = "AR" | "EN";

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
};
const applyLang = (lang: Lang) => {
  document.documentElement.lang = lang === "AR" ? "ar" : "en";
  document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
};

export const useDarkMode = () => {
  const [dark, setDark] = useState<boolean>(() => getTheme() === "dark");
  useEffect(() => { applyTheme(dark); saveTheme(dark ? "dark" : "light"); }, [dark]);
  const toggle = useCallback(() => setDark(d => !d), []);
  return { dark, toggle };
};

export const useLang = () => {
  const [lang, setLang] = useState<Lang>(() => getStoredLang() || "AR");
  useEffect(() => { applyLang(lang); saveLang(lang); }, [lang]);
  const toggle = useCallback(() => setLang(l => (l === "AR" ? "EN" : "AR")), []);
  return { lang, toggle };
};
