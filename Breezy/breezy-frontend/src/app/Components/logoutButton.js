"use client"; 
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice"; 
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    router.push("auth//login");
           
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      {t(logout)}
    </button>
  );
};

export default LogoutButton;
