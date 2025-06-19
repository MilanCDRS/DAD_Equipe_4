// app/layout.js
"use client";
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store/store";
import TranslationProvider from "./lib/TranslationProvider";
import LangSwitcher from "@/components/LangSwitcher";
import "./globals.css";


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
