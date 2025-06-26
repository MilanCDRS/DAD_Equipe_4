// src/store/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/api";

// 1.a Récupérer les infos du profil connecté
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue, getState }) => {
    const userId = getState().auth.user.userId;
    try {
      const { data } = await apiClient.get(`/auth/users/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    info: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(fetchProfile.fulfilled, (s, a) => {
      s.status = "succeeded";
      s.info = a.payload;
    });
    b.addCase(fetchProfile.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload;
    });
  },
});

export default profileSlice.reducer;
