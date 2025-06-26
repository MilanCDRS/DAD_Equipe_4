/* src/store/authSlice.js */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import apiClient from "@/utils/api";
import { loginUser } from "@/utils/api";

// TOUT CE QUI TOUCHE A LA CONNEXION / AUTHENTIFICATION

// on renvoie userInfo (le back pose les cookies)
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/register", formData);
      // res.data : { userId, username, role, email }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// avant : renvoyait seulement userId, username, email, role, token
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const {
        userId,
        username,
        email: em,
        role,
        bio,
        avatar,
        token,
      } = await loginUser(email, password);
      return { userId, username, email: em, role, bio, avatar, token };
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

// LOGOUT : appeler le back pour clearCookie, puis vider le store
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/auth/logout");
      return;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const tokenFromCookie = Cookies.get("token") || null;

const initialState = {
  user: null, // ou { userId, username, role, email }
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload;
        state.isAuthenticated = true; // on considère l’user loggé si back a posé le cookie
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.token = payload.token;
        state.user = {
          userId: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          bio: payload.bio,
          avatar: payload.avatar,
        };
        state.isAuthenticated = true;
        state.token = payload.token;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      });
  },
});

export default authSlice.reducer;
