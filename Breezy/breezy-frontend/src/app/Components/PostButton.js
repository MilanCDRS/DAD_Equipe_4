"use client";
import { useRouter } from "next/navigation";

export default function PostButton() {
  const router = useRouter();

  return (
    <button
      aria-label="Nouveau post"
      onClick={() => router.push("/create-post")}
      className="bg-blue-400 hover:bg-blue-500 transition-colors shadow-lg rounded-full w-14 h-14 flex items-center justify-center z-50 cursor-pointer"
      type="button"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 20c2 0 4-3 8-3s6 3 8 3"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14c1.5 0 3-2 8-2s6.5 2 8 2"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    </button>
  );
}
