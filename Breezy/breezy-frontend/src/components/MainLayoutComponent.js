// src/Components/Layout.js
"use client";

import Footer from "./Footer";
import Navbar from "./navbar";

export default function MainLayoutComponent({ children }) {
  return (
    <div className="bg-[#f7f9fa] flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <Footer />
    </div>
  );
}
