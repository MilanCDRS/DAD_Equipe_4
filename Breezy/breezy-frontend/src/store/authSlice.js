/* src/store/authSlice.js */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/api";

// Enregistrement
export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { userId, username, email, role, bio, avatar } = (
        await apiClient.post("/auth/register", formData)
      ).data;
      return { userId, username, email, role, bio, avatar };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Connexion
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
      } = (await apiClient.post("/auth/login", { email, password })).data;
      return { userId, username, email: em, role, bio, avatar };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Déconnexion
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Cette route lit req.cookies.accessToken et renvoie payload ou 401/403
      const { userId, role, username, email, bio, avatar } = (
        await apiClient.get("/auth/authenticate")
      ).data;
      return { userId, role, username, email, bio, avatar };
    } catch (err) {
      return rejectWithValue(err.response?.status);
    }
  }
);

const initialState = {
  user: null,
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
      // checkAuth
      .addCase(checkAuth.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(checkAuth.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.isAuthenticated = true;
        s.user = payload;
      })
      .addCase(checkAuth.rejected, (s) => {
        s.status = "failed";
        s.isAuthenticated = false;
        s.user = null;
      })
      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = payload;
        state.isAuthenticated = true;
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
        state.user = payload;
        state.isAuthenticated = true;
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
