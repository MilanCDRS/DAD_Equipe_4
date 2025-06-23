import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { registerUser, loginUser } from "../utils/api";

export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { userId, token } = await registerUser(formData);
      return { userId, token };
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const {
        userId,
        username,
        email: em,
        role,
        token,
      } = await loginUser(email, password);
      return { userId, username, email: em, role, token };
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

const initialState = {
  user: null,
  token: Cookies.get("token") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
    },
  },
  extraReducers: (b) => {
    b
      // REGISTER
      .addCase(register.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(register.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.token = payload.token;
        s.user = { userId: payload.userId };
        Cookies.set("token", payload.token, { sameSite: "Strict" });
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // LOGIN
      .addCase(login.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.token = payload.token;
        s.user = {
          userId: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        };
        Cookies.set("token", payload.token, { sameSite: "Strict" });
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
