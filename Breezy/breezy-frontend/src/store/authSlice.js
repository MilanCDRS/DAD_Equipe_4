const { createSlice } = require("@reduxjs/toolkit"); // on importe la fonction createSlice de redux toolkit

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

/** 
 * Slice dédié à l'authentification.
 * @param {string} name - Le nom de la slice, utilisé pour l'identigier dans le store global.
 * @param {object} initialState - L'état initial de la slice, qui définit les valeurs par défaut.
 * @param {object} reducers - Un objet contenant les reducers (fonctions qui modifient l'état) de la slice. On dit qu'on dispatch l'action pour modifier l'état.

*/
const authSlice = createSlice({
  name: "auth",
  initialState, // l'état init qu'on a défini au dessus
  // objet qui contient les reducers et donc les actions que la slice peut gérer
  reducers: {
    /**
     * Action pour gérer la connexion réussie d'un utilisateur.
     * @param {object} state - L'état actuel de la slice.
     * @param {object} action - L'action qui contient le payload avec les données de l'utilisateur et le token.
     */
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    /**
     * Action pour gérer la déconnexion d'un utilisateur.
     * @param {object} state - L'état actuel de la slice.
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
  },
});

// ici on exporte les actions générées par createSlice: c'est les fonctions qu'on'appelle pour modifier l'état de la slice.
export const { loginSuccess, logout } = authSlice.actions;

// chaque slice a un reducer principal, on l'expote pour l'ajouter au store global
export default authSlice.reducer;
