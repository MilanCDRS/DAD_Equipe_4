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
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
  const response = await apiClient.get(`/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiClient.patch(`/${userId}`, userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get("/");
  return response.data;
};

export default apiClient;
