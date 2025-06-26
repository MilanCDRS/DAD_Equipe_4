import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers } from "../utils/api";

// Thunk to fetch users with optional search term
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getAllUsers(params);
      return data.users || data;
    } catch (err) {
      // err.response?.data peut être { message: "…" }
      const msg = err.response?.data?.message || err.message || "Erreur réseau";
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  users: [],
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
