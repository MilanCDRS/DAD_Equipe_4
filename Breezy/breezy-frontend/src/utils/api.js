import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000, // Timeout de 10 seconds
  withCredentials: true, // Permet d'envoyer les cookies HttpOnly
});

// On injecte automatiquement le token depuis le cookie, on exclut /auth/register & /auth/login puis on ajoute l’Authorization
// sur 401/403, tenter un refresh une fois
apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    // si 401 ou 403 sur accessToken expiré
    if (err.response?.status === 401 || err.response?.status === 403) {
      // tente un refresh
      await apiClient.post("/auth/refresh-token");
      // puis refait la requête initiale
      return apiClient(err.config);
    }
    return Promise.reject(err);
  }
);

/**
 * POST /auth/login
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

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

export const addComment = (postId, text) =>
  apiClient.post(`/posts/${postId}/comments`, { text }).then((res) => res.data);

export const getPostsByUser = (username) =>
  apiClient.get(`/posts/user/${username}`).then((res) => res.data);

export const getPostsCommentedByUser = (username) =>  
  apiClient.get(`/posts/commented/${username}`).then((res) => res.data);

export const getPostsLikedByUser = (username) =>  
  apiClient.get(`/posts/liked/${username}`).then((res) => res.data);

export default apiClient;
