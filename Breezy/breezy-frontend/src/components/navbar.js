"use client";

import { useState, useRef, useEffect } from "react";
import { SettingsIcon, UserIcon } from "lucide-react";
import BreezyLogo from "../BreezyLogo";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout as logoutAction } from "@/store/authSlice";
import LangSwitcher from "./LangSwitcher";

/**
 * Navbar fixe en haut avec spacer intégré
 * Gère un dropdown pour Settings (déconnexion + langue)
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Ferme le dropdown au clic hors zone
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // on appelle l'API qui clear les cookies httpOnly
      await dispatch(logoutAction()).unwrap();
      // puis on vide le store et redirige
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Déconnexion impossible pour le moment.");
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-20">
        <nav className="container mx-auto flex items-center justify-center space-x-24 h-16">
          <Link
            href="/profilePages/profile"
            className="text-black hover:text-blue-500"
          >
            <UserIcon size={24} />
          </Link>

          <Link href="/" className="text-black hover:text-blue-500">
            <BreezyLogo width={24} height={24} />
          </Link>

          <div ref={containerRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-black hover:text-blue-500 focus:outline-none"
            >
              <SettingsIcon size={24} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                >
                  Se déconnecter
                </button>
                <div className="border-t" />
                <div className="px-4 py-2">
                  <LangSwitcher />
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Spacer pour éviter que le contenu passe sous la navbar fixe */}
      <div className="h-16" />
    </>
  );
}
