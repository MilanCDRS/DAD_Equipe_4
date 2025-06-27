import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000, // Timeout de 10 seconds
  withCredentials: true, // Permet d'envoyer les cookies HttpOnly
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    const status = error.response?.status;

    // Ne retry ni sur refresh-token, ni authenticate, ni logout
    if (
      orig.url?.includes("/auth/refresh-token") ||
      orig.url?.includes("/auth/authenticate") ||
      orig.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !orig._retry) {
      orig._retry = true;
      await apiClient.post("/auth/refresh-token");
      return apiClient(orig);
    }
    return Promise.reject(error);
  }
);

/**
 * API AUTH
 */

export const registerUser = async (userData) => {
  console.log("Registering user with data:", userData);
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await apiClient.get(`/auth/users/${username}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  console.log("Updating profile with data:", profileData);
  const response = await apiClient.patch("/auth/profile", profileData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const getAllUsers = async ({
  page = 1,
  limit = 15,
  search = "",
} = {}) => {
  const response = await apiClient.get("/auth/users", {
    params: { page, limit, search },
  });
  return response.data;
  // (ou `return { users: response.data }`
};

/**
 * API PUBLIC
 */
export const getUsersFollowers = async (username) => 
  apiClient.get(`/follower/user/${username}`);

export const getAllPosts = () =>
  apiClient.get("/posts").then((res) => res.data);

export const createPost = (formData) =>
  apiClient.post("/posts", formData).then((res) => res.data);

export const likePost = (postId) =>
  apiClient.put(`/posts/${postId}/like`).then((res) => res.data);

export const addComment = (postId, text, parentCommentId = null) =>
  apiClient
    .post(`/posts/${postId}/comments`, { text, parentCommentId })
    .then((res) => res.data);

export const logout = () => {
  return apiClient.post("/auth/logout");
};
export const getPostsByUser = (username) =>
  apiClient.get(`/posts/user/${username}`).then((res) => res.data);

export const getPostsCommentedByUser = (username) =>  
  apiClient.get(`/posts/commented/${username}`).then((res) => res.data);

export const getPostsLikedByUser = (username) =>  
  apiClient.get(`/posts/liked/${username}`).then((res) => res.data);

export default apiClient;
