
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/api";
import {
  getPostsByUser,
  getPostsCommentedByUser,
  getPostsLikedByUser,
  getUsersFollowers,
} from "@/utils/api";

// Thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (username, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/auth/users/${username}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (username, { rejectWithValue }) => {
    try {
      const posts = await getPostsByUser(username);
      return posts;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPostsCommentedByUser = createAsyncThunk(
  "commentedPosts/fetchByUser",
  async (username, { rejectWithValue }) => {
    try {
      const posts = await getPostsCommentedByUser(username);
      return posts;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPostsLikedByUser = createAsyncThunk(
  "likedPosts/fetchByUser",
  async (username, { rejectWithValue }) => {
    try {
      const posts = await getPostsLikedByUser(username);
      return posts;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsersFollowers = createAsyncThunk(
  "follower/fetchByUser",
  async (profileUsername, { rejectWithValue }) => {
    try {
      const data = await getUsersFollowers(profileUsername);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const initialState = {
  user: null,
  posts: [],
  comments: [],
  likes: [],
  followers: [],          // 👈 ajouté
  followings: [],         // 👈 ajouté
  followersCount: 0,
  followingsCount: 0,
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchProfile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // fetchPostsByUser
    builder
      .addCase(fetchPostsByUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPostsByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // fetchPostsCommentedByUser
    builder
      .addCase(fetchPostsCommentedByUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsCommentedByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchPostsCommentedByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // fetchPostsLikedByUser
    builder
      .addCase(fetchPostsLikedByUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsLikedByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likes = action.payload;
      })
      .addCase(fetchPostsLikedByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // fetchUsersFollowers
    builder
      .addCase(fetchUsersFollowers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsersFollowers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.followers = action.payload.followers || [];               // 👈
        state.followings = action.payload.followings || [];             // 👈
        state.followersCount = action.payload.followersCount || 0;
        state.followingsCount = action.payload.followingsCount || 0;
      })
      .addCase(fetchUsersFollowers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;