import { useTranslation } from "../app/lib/TranslationProvider";

export default function LangSwitcher() {
  const { lang, setLang } = useTranslation();
  return (
    <button
      className="underline"
      onClick={() => {
        const next = lang === "fr" ? "en" : "fr";
        setLang(next);
        localStorage.setItem("lang", next);
      }}
    >
      {lang === "fr" ? "English" : "Français"}
    </button>
  );
}
