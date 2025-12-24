import axios from "axios";
import { getClientUUID } from "../utils/device";
import { getToken } from "../utils/cookies";

const url = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const uuid = getClientUUID();
  const token = getToken(); 
  if (uuid) config.headers["Client-Device-Uuid"] = uuid;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
