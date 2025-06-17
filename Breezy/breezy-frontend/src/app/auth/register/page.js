// src/app/auth/register/page.js
"use client";

import Link from "next/link";
import MyIcon from "@/app/MyIcon";
import { useEffect, useState } from "react";
import { useTranslation } from "../../lib/TranslationProvider";

export default function CreateAccountPage() {
  const { t } = useTranslation();
  const [maxDate, setMaxDate] = useState("");

  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 16);
    setMaxDate(today.toISOString().split("T")[0]);
  }, []);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validatePassword = (pwd) => {
    const errs = [];
    if (pwd.length < 12) errs.push(t("passwordMinLength"));
    if (!/[A-Z]/.test(pwd)) errs.push(t("passwordUppercase"));
    if (!/[0-9]/.test(pwd)) errs.push(t("passwordNumber"));
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) errs.push(t("passwordSpecial"));
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!name.trim()) validationErrors.push(t("nameRequired"));
    if (!pseudo.trim()) validationErrors.push(t("pseudoRequired"));
    if (!isValidEmail(email)) validationErrors.push(t("invalidEmail"));
    if (!birthdate) validationErrors.push(t("birthdateRequired"));
    if (password !== confirmPassword)
      validationErrors.push(t("passwordMismatch"));

    validationErrors.push(...validatePassword(password));
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      alert(t("formValid") || "Form is valid. Submitting...");
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
