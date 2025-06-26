// app/layout.js
"use client";

import { Provider as ReduxProvider } from "react-redux";
import store from "../store/store";
import AuthGuard from "@/components/AuthGuard";
import TranslationProvider from "./lib/TranslationProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <ReduxProvider store={store}>
          <AuthGuard>
            <TranslationProvider>
              <main className="flex-1">{children}</main>
            </TranslationProvider>
          </AuthGuard>
        </ReduxProvider>
      </body>
    </html>
  );
}
