// app/layout.js
"use client";
import { Provider, useDispatch } from "react-redux";
import store from "@/store/store";
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
      </body>
    </html>
  );
}
