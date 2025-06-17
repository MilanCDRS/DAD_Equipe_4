// src/app/auth/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyIcon from "@/app/MyIcon";
import { login } from "@/store/authSlice";
import { useTranslation } from "@/app/lib/TranslationProvider";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push("/");
    } catch (err) {
      alert(`${t("loginFailed")}: ${err.message || t("unknownError")}`);
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 pt-8 pb-10 sm:px-10 sm:pt-12 font-[var(--font-geist-sans)]">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center mb-10">
          <MyIcon />
        </div>

        <h1
          className="text-3xl font-bold text-black mb-10 text-center leading-tight"
          dangerouslySetInnerHTML={{ __html: t("homePhrase") }}
        />

        <button
          onClick={() => router.push("/auth/register")}
          className="w-full text-sm text-white bg-black rounded-full px-6 py-3 mb-6"
        >
          {t("createAccount")}
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="flex-grow h-px bg-black" />
          <span className="px-4 text-black font-medium text-sm">{t("or")}</span>
          <div className="flex-grow h-px bg-black" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder={t("pseudoOrEmail")}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder={t("password")}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-right text-sm">
            <i>
              <Link href="#" className="text-blue-500 underline">
                {t("forgotPassword")}
              </Link>
            </i>
          </div>

          <button
            type="submit"
            className="w-full text-sm text-white bg-black rounded-full px-6 py-3"
          >
            {t("toLogIn")}
          </button>

          {status === "failed" && (
            <p className="text-red-500">
              {error?.message || error || t("unknownError")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
