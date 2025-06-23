'use client'
import MyIcon from "@/app/MyIcon";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "../../lib/TranslationProvider";
import { registerUser } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const today = new Date();
  today.setFullYear(today.getFullYear() - 16);
  const initialMaxDate = today.toISOString().split("T")[0];
  const [maxDate] = useState(initialMaxDate);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // Plus aucune validation du password !
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!name.trim()) validationErrors.push(t("nameRequired"));
    if (!pseudo.trim()) validationErrors.push(t("pseudoRequired"));
    if (!isValidEmail(email)) validationErrors.push(t("invalidEmail"));
    if (!birthdate) validationErrors.push(t("birthdateRequired"));
    if (password !== confirmPassword)
      validationErrors.push(t("passwordMismatch"));

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const payload = {
        name: name.trim(),
        username: pseudo,
        email,
        password,
        dateOfBirth: new Date(birthdate).toISOString(),
      };
      try {
        const data = await registerUser(payload);
        router.push(`/auth/complete-profile/${data.userId}`);
        if (data?.user?.username !== pseudo) {
          alert(`${t("pseudoChanged")} ${data.user.username}`)
        }
      } catch (err) {
        const field = err?.response?.data?.field;
        const message = err?.response?.data?.message || "Erreur lors de la création";
        if (field === "email") {
          setErrors([message]);
        }
      }
    }
  };

  return (
    <div className="bg-white min-h-screen font-[var(--font-geist-sans)] px-6 pt-8 pb-10 sm:px-10 sm:pt-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="w-[70px]">
            <Link href="/auth/login" className="text-sm text-black font-medium">
              {t("cancel")}
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <MyIcon />
          </div>
          <div className="w-[70px]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">
          {t("createYourAccount")}
        </h1>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("firstLastName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="date"
            placeholder={t("birthdate")}
            value={birthdate}
            max={maxDate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border-b border-[#5B5F63] text-[#A2A5A9] focus:text-black focus:outline-none focus:border-black p-2 bg-transparent"
          />

          <input
            type="text"
            placeholder={t("pseudo")}
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="password"
            placeholder={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          {errors.length > 0 && (
            <ul className="text-red-500 text-sm space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>• {err}</li>
              ))}
            </ul>
          )}

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="mt-6 text-sm text-white bg-black rounded-full px-6 py-3"
            >
              {t("next")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
