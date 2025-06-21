// src/lib/TranslationProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import fr from "../../locales/fr/common.json";
import en from "../../locales/en/common.json";
const dicts = { fr, en };

// 1) Crée le contexte
const TranslationContext = createContext({
  lang: "fr",
  t: (key) => key,
  setLang: () => {},
});

// 2) Le Provider
export default function TranslationProvider({ children }) {
  const [lang, setLang] = useState("fr");

  // Optionnel : récupérer la langue en localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && dicts[saved]) setLang(saved);
  }, []);

  // Fonction de traduction
  const t = (key) => dicts[lang][key] ?? key;

  return (
    <TranslationContext.Provider value={{ lang, t, setLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

// 3) Hook pour consommer
export function useTranslation() {
  return useContext(TranslationContext);
}
