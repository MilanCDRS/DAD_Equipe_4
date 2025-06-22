import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "https://localhost/api",
  timeout: 2000, // Timeout de 2 seconds
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

/**
 *  Requête API pour l'authentification d'un utilisateur.
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @return {Promise<Object>} - Une promesse qui résout les données de l'utilisateur connecté.
 */
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.patch("/auth/profile", profileData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get("/users/");
  return response.data;
};

export const getUsersFollowers = async (username) => {
  const response = await apiClient.post(`/followers/user/${username}`);
  return response.data;
};

export default apiClient;
