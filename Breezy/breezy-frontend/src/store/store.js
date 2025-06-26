"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import postReducer from "./postsSlice";
import profileReducer from "./profileSlice";
import usersReducer from "./usersSlice"; // Si vous avez une slice pour les utilisateurs

// C'est notre store global (redux) qui contient toutes les slices/reducers de l'application.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    profile: profileReducer,
    users: usersReducer, //  userS pour la recherche user ( vu qu'il y a pagination etc )
  },
});

export default store;
