// app/layout.js
"use client";
import { Provider, useDispatch } from "react-redux";
import store from "@/store/store";
import "./globals.css";
import { useEffect } from "react";
import { rehydrate } from "@/store/authSlice";

function Rehydrate() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      const user = JSON.parse(window.localStorage.getItem("user") || "null");
      if (token && user) {
        dispatch(rehydrate({ user, token }));
      }
    }
  }, [dispatch]);
  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Rehydrate />
          {children}
        </Provider>
      </body>
    </html>
  );
}
