"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyIcon from "@/app/MyIcon";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  // on récupère le status et l’erreur du thunk
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  // Si login réussi, on redirige vers home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Dispatch du thunk et unwrap permet de catcher l'erreur ici
      await dispatch(login({ email, password })).unwrap();
      // Si tout s'est bien passé, on redirige
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert(
        "Login failed: " +
          (err.message || err.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 pt-8 pb-10 sm:px-10 sm:pt-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center mb-10">
          <MyIcon />
        </div>

        <h1 className="text-3xl font-bold text-black mb-10 text-center leading-tight">
          Send and
          <br />
          receive messages
          <br />
          in real time.
        </h1>

        <Link href="/registration" className="block mb-6">
          <button className="w-full text-sm text-white bg-black rounded-full px-6 py-3">
            Create an account
          </button>
        </Link>

        <div className="flex items-center justify-center mb-6">
          <div className="flex-grow h-px bg-black" />
          <span className="px-4 text-black font-medium text-sm">or</span>
          <div className="flex-grow h-px bg-black" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            {/* Email input */}
            <input
              type="email"
              id="email"
              placeholder="pseudo or email"
              className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
              value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div>
            <input type="password" id="password" placeholder="password"
              className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
              value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <div className="text-right text-sm">
            <i>
              <Link href="#" className="text-blue-500 underline">Forgotten password ?</Link>
            </i>
          </div>

          <button
            type="submit"
            className="w-full text-sm text-white bg-black rounded-full px-6 py-3"
          >
            Log in
          </button>
          {status === "failed" && (
            <p className="text-red-500">
              {error?.message || error || "Erreur inconnue"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
