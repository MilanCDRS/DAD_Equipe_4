"use client"; // [REACT] Obligatoire car on utilise des hooks, cela permet de dire à Next.js que ce fichier est un composant React.
import { Provider } from "react-redux";
import store from "@/store/store";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 
          Le Provider de Redux rend ton store accessible à tous tes composants.
        */}
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
