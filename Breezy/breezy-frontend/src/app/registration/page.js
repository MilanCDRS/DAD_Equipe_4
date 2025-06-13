'use client';
import MyIcon from "@/app/MyIcon";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreateAccountPage() {
  const [maxDate, setMaxDate] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 16);
    const formatted = today.toISOString().split("T")[0];
    setMaxDate(formatted);
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 12) errors.push("Password must be at least 12 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("Password must contain at least one special character");
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!name.trim()) validationErrors.push("Name is required");
    if (!pseudo.trim()) validationErrors.push("Pseudo is required");

    if (!isValidEmail(email)) validationErrors.push("Please enter a valid email address");

    if (!birthdate) validationErrors.push("Birthdate is required");

    if (password !== confirmPassword) validationErrors.push("Passwords do not match");

    validationErrors.push(...validatePassword(password));

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      alert("Form is valid. Submitting...");
    }
  };

  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-geist-sans)] px-6 pt-8 pb-10 sm:px-10 sm:pt-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
  <div className="w-[70px]">
    <Link href="/auth/login" className="text-sm text-black font-medium">Cancel</Link>
  </div>
  <div className="flex-1 flex justify-center">
    <MyIcon />
  </div>
  <div className="w-[70px]" />
</div>


        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">Create your account</h1>

        <form className="w-full space-y-5 relative" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First and last name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="date"
            value={birthdate}
            max={maxDate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border-b border-[#5B5F63] text-[#A2A5A9] focus:text-black focus:outline-none focus:border-black p-2 bg-transparent"
          />

          <input
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black p-2 bg-transparent"
          />

          {errors.length > 0 && (
            <ul className="text-red-500 text-sm space-y-1">
              {errors.map((err, idx) => <li key={idx}>• {err}</li>)}
            </ul>
          )}

          <div className="w-full flex justify-end">
            <Link href="/profile-setup">
              <button type="submit" className="mt-6 text-sm text-white bg-black rounded-full px-6 py-3">Next</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
