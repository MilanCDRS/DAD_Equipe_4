// src/app/page.js (ou wherever Home lives)
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { useTranslation } from "@/app/lib/TranslationProvider";
import Footer from "./Components/Footer"; // Composant Footer


export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (!isAuth) router.push("/auth/login");
  }, [isAuth, router]);

  if (!isAuth) return <p>{t("loading")}</p>;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("welcome")} Breezy !</h1>
      <p>{t("userInfo")}</p>
      <ul className="mt-4 space-y-2">
        <li>
          <strong>{t("username")} :</strong> {user?.username}
        </li>
        <li>
          <strong>{t("email")} :</strong> {user?.email}
        </li>
        <li>
          <strong>{t("role")} :</strong> {user?.role}
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        {t("logout")}
      </button>
      
    </div>
  );
}
