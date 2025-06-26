import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/api";

// INFO DU USER CONNECTE

// Charge les infos complètes du user
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { getState, rejectWithValue }) => {
    const userId = getState().auth.user?.userId;
    try {
      const { data } = await apiClient.get(`/users/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || err);
    }
  }
);

// Update bio + avatar
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = { user: null, status: "idle", error: null };
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile(s) {
      s.user = null;
      s.status = "idle";
      s.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(getProfile.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(getProfile.fulfilled, (s, a) => {
        s.status = "succeeded";
        const p = a.payload;
        s.user = {
          userId: p._id,
          username: p.username,
          email: p.email,
          role: p.role,
          bio: p.bio,
          avatar: p.avatar,
        };
      })
      .addCase(getProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      .addCase(updateProfile.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = { ...s.user, ...a.payload };
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
