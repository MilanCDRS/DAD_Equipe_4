const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit"); // on importe la fonction createSlice de redux toolkit
import { loginUser } from "@/utils/api"; // on importe le localStorage pour la persistance

// Thunk pour l'appel /login de l'API.
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);
      // on attend que loginUser renvoie { userId, username, email, role, token }
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// On ne lit le localStorage qu'en client
const isBrowser = typeof window !== "undefined";
const tokenFromStorage = isBrowser
  ? window.localStorage.getItem("token")
  : null;
const userFromStorage = isBrowser
  ? JSON.parse(window.localStorage.getItem("user") || "null")
  : null;

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!tokenFromStorage,
  token: tokenFromStorage,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

/** 
 * Slice dédié à l'authentification.
 * @param {string} name - Le nom de la slice, utilisé pour l'identigier dans le store global.
 * @param {object} initialState - L'état initial de la slice, qui définit les valeurs par défaut.
 * @param {object} reducers - Un objet contenant les reducers (fonctions qui modifient l'état) de la slice. On dit qu'on dispatch l'action pour modifier l'état.

*/

const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers synchrones
  reducers: {
    /**
     * Déconnexion :
     * - on reset tout l’état
     * - on supprime la persistance en localStorage
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  // réhydratation de l'état depuis le localStorage
  rehydrate(state, action) {
    const { user, token } = action.payload;
    state.user = user;
    state.token = token;
    state.isAuthenticated = true;
  },
  //  Gère les états de la requête asynchrone `login`
  extraReducers: (builder) => {
    builder
      // Quand on lance `dispatch(login(...))`
      .addCase(login.pending, (state) => {
        state.status = "loading"; // on est en cours
        state.error = null; // on reset l’erreur
      })
      // Quand la promesse est résolue avec succès
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"; // terminé OK
        state.isAuthenticated = true; // on est connecté
        state.token = action.payload.token; // on stocke le token
        // on construit l’objet user à partir de la réponse
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role,
          userId: action.payload.userId,
        };
        // Persistance dans localStorage pour reloads
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      // En cas d’erreur réseau ou 4xx/5xx
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// ici on exporte les actions générées par createSlice: c'est les fonctions qu'on'appelle pour modifier l'état de la slice (il n'y a plus loginSuccess)
export const { logout, rehydrate } = authSlice.actions;

// chaque slice a un reducer principal, on l'expote pour l'ajouter au store global
export default authSlice.reducer;
