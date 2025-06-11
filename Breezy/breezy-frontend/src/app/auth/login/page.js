"use client"; // [REACT] Obligatoire car on utilise des hooks, cela permet de dire à Next.js que ce fichier est un composant React.

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyIcon from "@/app/MyIcon";

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
    <div className="flex flex-col items-center justify-center p-8 sm:p-20 font-sans bg-white">
      {/* Logo */}
      <br />
      <br />
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 flex justify-center items-center mb-2">
          <MyIcon />
        </div>
        <br />
        <p className="font-bold text-2xl sm:text-3xl text-left w-full sm:w-auto text-center sm:text-left">
          Send and receive messages with breezy in real time.
        </p>
      </div>

      {/* Form auth + bouton Create  */}
      <div className="w-full sm:w-4/5 md:w-2/3 xl:w-1/2 flex flex-col items-center text-gray-800">
        <Link href="/registration" className="w-full mb-4">
          <button className="w-full rounded-full bg-gray-900 p-4 sm:p-5 hover:bg-gray-600 text-white">
            Create an account
          </button>
        </Link>

        <fieldset className="border-t border-solid border-gray-800 w-full mb-6">
          <legend className="mx-auto px-2 text-center font-bold text-sm">
            Or login
          </legend>
        </fieldset>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block font-medium text-gray-800" htmlFor="email">
              Email or username
            </label>
            <input
              type="email"
              id="email"
              placeholder="mail@user.com"
              className="w-full rounded-xl bg-white p-2.5 border border-gray-800 text-black placeholder-indigo-900 shadow placeholder:opacity-30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block font-medium text-gray-800"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-xl bg-white p-2.5 border border-gray-800 text-black placeholder-indigo-900 shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center text-sm">
            <i>
              <Link href="#" className="underline text-blue-400">
                Forgotten password ?
              </Link>
            </i>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gray-900 p-4 sm:p-5 hover:bg-gray-600 text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
