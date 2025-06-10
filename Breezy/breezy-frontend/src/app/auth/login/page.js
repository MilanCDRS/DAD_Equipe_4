"use client"; // [REACT] Obligatoire car on utilise des hooks, cela permet de dire à Next.js que ce fichier est un composant React.

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    try {
      const data = await loginUser(email, password); // Appel centralisé à l'API
      const { userId, username, role, token } = data; // destructuration des données reçues de l'API

      // !! Si la requête est réussie, on dispatch l'action loginSuccess avec les données de l'utilisateur et le token. C'est grâce à ces données chargées
      // qu'on va pouvoir afficher les info de l'uti dans la paged'accueil
      dispatch(
        loginSuccess({
          user: { id: userId, username, role, email },
          token,
        })
      );
      console.log("Login successful:", data);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
