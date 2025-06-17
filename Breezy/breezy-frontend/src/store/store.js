"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// C'est notre store global (redux) qui contient toutes les slices/reducers de l'application.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
