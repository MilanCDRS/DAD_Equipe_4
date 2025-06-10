"use client"; // Obligatoire, car on utilise des hooks client

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice"; // Action de déconnexion

export default function Home() {
  // Accès au store Redux
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  // Redirection si non authentifié
  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return <p>Chargement...</p>; // petit loading le temps que ça redirige
  }

  // Bouton de déconnexion
  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur Breezy !</h1>
      <p>Voici vos informations :</p>
      <ul className="mt-4 space-y-2">
        <li>
          <strong>Nom d'utilisateur :</strong> {user?.username}
        </li>
        <li>
          <strong>Email :</strong> {user?.email}
        </li>
        <li>
          <strong>Rôle :</strong> {user?.role}
        </li>
      </ul>
    </div>
  );
}
