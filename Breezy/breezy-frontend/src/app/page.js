// src/app/page.js (ou wherever Home lives)
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import { useTranslation } from "@/app/lib/TranslationProvider";
import Post from "./Components/post";


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

  // const handleLogout = () => {
  //   dispatch(logout());
  //   router.push("/auth/login");
  // };

  return (
    <div>
        <Post/>
    </div>
  );
}
