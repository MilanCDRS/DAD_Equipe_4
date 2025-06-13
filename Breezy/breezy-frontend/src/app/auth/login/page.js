'use client';

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyIcon from "@/app/MyIcon";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      const { userId, username, role, token } = data;

      dispatch(loginSuccess({
        user: { id: userId, username, role, email },
        token,
      }));

      router.push("/");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 pt-8 pb-10 sm:px-10 sm:pt-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <MyIcon />
        </div>

        {/* Slogan */}
        <h1 className="text-3xl font-bold text-black mb-10 text-center leading-tight">
          Send and<br />receive messages<br />in real time.
        </h1>

        {/* Create Account button */}
        <Link href="/registration" className="block mb-6">
          <button className="w-full text-sm text-white bg-black rounded-full px-6 py-3">
            Create an account
          </button>
        </Link>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex-grow h-px bg-black" />
          <span className="px-4 text-black font-medium text-sm">or</span>
          <div className="flex-grow h-px bg-black" />
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="pseudo or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] text-black bg-transparent p-2 focus:outline-none focus:border-black"
          />

          <div className="text-right text-sm">
            <Link href="#" className="text-blue-500 underline">
              Forgotten password ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-sm text-white bg-black rounded-full px-6 py-3"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
