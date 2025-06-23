import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "https://localhost/api",
  timeout: 10000, // Timeout de 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// On injecte automatiquement le token depuis le cookie
apiClient.interceptors.request.use((config) => {
  // Ne pas ajouter le token pour les routes d'inscription ou de connexion
  const noAuthNeeded = ["/auth/register", "/auth/login"];
  if (!noAuthNeeded.includes(config.url)) {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Avant chaque requête, on injecte l’Authorization sauf pour /auth/*
apiClient.interceptors.request.use((config) => {
  if (!config.url.startsWith("/auth/")) {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * POST /auth/login
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

/**
 * POST /auth/register
 */
export const registerUser = async (userData) => {
  console.log("Registering user with data:", userData);
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

/**
 * GET /users/:id
 */
export const getUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * PATCH /auth/profile
 * @note : pour l'envoi de FormData (avatar + bio) on
 *        utilisera directement axios/form-data dans le thunk (action/fonction du store qu'on voit en haut du fichier ).
 */
export const updateProfile = async (profileData) => {
  const response = await apiClient.patch("/auth/profile", profileData);
  return response.data;
};

/**
 * GET /users
 */
export const getAllUsers = async () => {
  const response = await apiClient.get("/users/");
  return response.data;
};

export const getUsersFollowers = async (username) => {
  const response = await apiClient.post(`/followers/user/${username}`);
  return response.data;
};

export default apiClient;
