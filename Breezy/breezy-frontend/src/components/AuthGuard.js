// components/AuthGuard.js
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth } from "@/store/authSlice";

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full animate-spin" />
    </div>
  );
}

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, isAuthenticated } = useSelector((s) => s.auth);

  const skipAuth = pathname.startsWith("/auth");

  // 2 tous les Hooks sont appelés **quelle que soit la route**
  useEffect(() => {
    if (!skipAuth && status === "idle") {
      dispatch(checkAuth());
    }
  }, [skipAuth, status, dispatch]);

  useEffect(() => {
    if (!skipAuth && status === "failed") {
      router.replace("/auth/login");
    }
  }, [skipAuth, status, router]);

  // cas public : /auth/*
  if (skipAuth) {
    return <>{children}</>;
  }

  // cas en attente du check côté serveur
  if (status === "idle" || status === "loading") {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Spinner />;
  }

  // cas OK : on rend enfin le contenu protégé
  return <>{children}</>;
}
