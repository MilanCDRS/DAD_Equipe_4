// src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/api"; // axios avec token dans l’intercepteur

// Récupérer le profil complet de l’utilisateur (qui est déjà authentifié)
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { getState, rejectWithValue }) => {
    const { userId } = getState().auth; // on lit l’ID depuis authSlice
    try {
      const res = await apiClient.get(`/users/${userId}`);
      return res.data; // { _id, username, email, role, bio, avatar, … }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch("/auth/profile", profileData);
      return res.user; // { userId, username, email, role, bio, avatar }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  user: null, // contiendra username, email, bio, avatar…
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // permet de vider les infos profil à la déconnexion
    clearProfile(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = {
          userId: payload._id,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          bio: payload.bio,
          avatar: payload.avatar,
          followersCount: payload.followersCount || 0,
          followingsCount: payload.followingsCount || 0,
        };
      })
      .addCase(getProfile.rejected, (state, { payload, error }) => {
        state.status = "failed";
        state.error = payload || error.message;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...payload };
      })
      .addCase(updateProfile.rejected, (state, { payload, error }) => {
        state.status = "failed";
        state.error = payload || error.message;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;