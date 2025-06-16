const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit"); // on importe la fonction createSlice de redux toolkit
import { loginUser } from "@/utils/api";
import Cookies from "js-cookie";

// Thunk pour l'appel /login de l'API.
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      return data; // { userId, username, email, role, token }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Au démarrage, on lit le cookie "token" et "user"
const tokenFromCookie = Cookies.get("token");
const userFromCookie = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : null;

const initialState = {
  user: userFromCookie,
  isAuthenticated: !!tokenFromCookie,
  token: tokenFromCookie,
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
     * - on efface les cookikes
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      // effacer les cookies
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
  //  Gère les états de la requête asynchrone `login`
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role,
          userId: action.payload.userId,
        };
        // persister dans les cookies
        Cookies.set("token", action.payload.token, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          // pas d'expiration ici, sinon ajoutez : expires: 7  (jours)
        });
        Cookies.set("user", JSON.stringify(state.user), {
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

// ici on exporte les actions générées par createSlice: c'est les fonctions qu'on'appelle pour modifier l'état de la slice (il n'y a plus loginSuccess)
export const { logout } = authSlice.actions;

// chaque slice a un reducer principal, on l'expote pour l'ajouter au store global
export default authSlice.reducer;
