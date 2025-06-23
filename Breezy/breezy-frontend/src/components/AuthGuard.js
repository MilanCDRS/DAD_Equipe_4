// components/AuthGuard.jsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function Spinner() {
  return (
    <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin" />
  );
}

export default function AuthGuard({ children }) {
  const token = useSelector((s) => s.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, router]);

  // tant qu’on n’a pas de token, on n’affiche rien
  if (!token) return <Spinner />;

  return <>{children}</>;
}
