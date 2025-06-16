import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000, // Timeout de 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// si un jour on veut stocker le token en localStorage
apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

export default apiClient;
