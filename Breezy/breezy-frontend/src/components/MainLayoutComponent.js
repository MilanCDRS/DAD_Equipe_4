// src/Components/Layout.js
"use client";

import Footer from "./Footer";
import Navbar from "./navbar";
import CreatePostButton from "./CreatePostButton";

export default function MainLayoutComponent({ currentUser, children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={currentUser} />

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <div className="fixed bottom-6 right-6 z-20">
        <CreatePostButton currentUser={currentUser} />
      </div>

      <Footer />
    </div>
  );
}
