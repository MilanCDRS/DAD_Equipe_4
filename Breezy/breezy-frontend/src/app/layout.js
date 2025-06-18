// app/layout.js
"use client";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";
import TranslationProvider from "./lib/TranslationProvider";
import LangSwitcher from "@/components/LangSwitcher";
import "./globals.css";
import { useEffect } from "react";
import { rehydrate } from "@/store/authSlice";
import PageTest from "./Components/pagetest";

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>
        <PageTest />
        <Provider store={store}>{children}
         
        </Provider>

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <ReduxProvider store={store}>
          <TranslationProvider>
            <header className="bg-gray-100 p-4">
              <LangSwitcher />
            </header>
            <main className="flex-1">{children}</main>
          </TranslationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
