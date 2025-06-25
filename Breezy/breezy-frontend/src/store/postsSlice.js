// src/store/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPosts, createPost, likePost, addComment } from "../utils/api";

// LA LISTE GENERIQUE DE TOUS LES POSTS
// Récupérer tous les posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPosts();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Créer un post
export const addPost = createAsyncThunk(
  "posts/add",
  async (formData, { rejectWithValue }) => {
    try {
      return await createPost(formData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Like/unlike
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      return await likePost(postId); // renvoie { likes: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Ajouter un commentaire
export const postComment = createAsyncThunk(
  "posts/postComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const comment = await addComment(postId, text);
      return { postId, comment };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.list = payload;
      })
      .addCase(fetchPosts.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })
      // addPost
      .addCase(addPost.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.list.unshift(payload); // ajoute en tête
      })
      .addCase(addPost.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })
      // toggleLike
      .addCase(toggleLike.fulfilled, (state, { payload, meta }) => {
        // payload = { likes: [...] }, meta.arg = postId
        const post = state.list.find((p) => p._id === meta.arg);
        if (post) post.likes = payload.likes;
      })
      // postComment
      .addCase(postComment.fulfilled, (state, { payload }) => {
        // payload = { postId, comment }
        const post = state.list.find((p) => p._id === payload.postId);
        if (post) post.comments.push(payload.comment);
      });
  },
});

export default postsSlice.reducer;
