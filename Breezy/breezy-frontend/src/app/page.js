"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.replace("/posts");
    } else {
      router.replace("/auth/login");
    }
  }, [isAuth, router]);

  // Option : affiche un loader
  return <div>Chargement...</div>;
}
