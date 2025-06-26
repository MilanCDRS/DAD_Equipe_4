// src/store/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPosts, createPost, likePost, addComment } from "../utils/api";

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

// Like / Unlike
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      return await likePost(postId); // doit retourner { likes: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Ajouter un commentaire ou une réponse
export const postComment = createAsyncThunk(
  "posts/postComment",
  async ({ postId, text, parentCommentId = null }, { rejectWithValue }) => {
    try {
      const comment = await addComment(postId, text, parentCommentId);
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
        state.list.unshift(payload); // ajoute en haut de la liste
      })
      .addCase(addPost.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })

      // toggleLike
      .addCase(toggleLike.fulfilled, (state, { payload, meta }) => {
        const post = state.list.find((p) => p._id === meta.arg);
        if (post) {
          post.likes = payload.likes;
        }
      })

      // postComment (gère commentaires + réponses imbriquées)
      .addCase(postComment.fulfilled, (state, { payload }) => {
        const { postId, comment } = payload;
        const post = state.list.find((p) => p._id === postId);
        if (!post) return;

        if (!comment.parentCommentId) {
          // Commentaire de niveau 1
          post.comments.push(comment);
        } else {
          // Réponse à un commentaire
          const insertReply = (comments) => {
            for (const c of comments) {
              if (c._id === comment.parentCommentId) {
                if (!c.replies) c.replies = [];
                c.replies.push(comment);
                return true;
              }
              if (c.replies && insertReply(c.replies)) return true;
            }
            return false;
          };
          insertReply(post.comments);
        }
      });
  },
});

export default postsSlice.reducer;
