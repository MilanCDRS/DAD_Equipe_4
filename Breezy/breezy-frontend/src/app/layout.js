// app/layout.js
"use client";

import { useEffect } from "react";
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import store from "../store/store";
import { getProfile } from "../store/userSlice";
import TranslationProvider from "./lib/TranslationProvider";
import "./globals.css";

// Petit wrapper pour initialiser l'app
function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const profileLoaded = useSelector((s) => s.user.user !== null);

  useEffect(() => {
    if (token && !profileLoaded) {
      dispatch(getProfile());
    }
  }, [token, profileLoaded, dispatch]);

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <ReduxProvider store={store}>
          <AppInitializer>
            <TranslationProvider>
              <main className="flex-1">{children}</main>
            </TranslationProvider>
          </AppInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
