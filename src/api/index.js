import axios from "axios";
import { getClientUUID } from "../utils/device";
import { getToken } from "../utils/cookies";

//const url = "http://192.168.0.16:3001";
// const url = "http://localhost:3001";
const url = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const uuid = getClientUUID();
  const token = getToken(); 

  console.log("TOKEN SENT:", token);

  if (uuid) config.headers["Client-Device-Uuid"] = uuid;
  if (token) config.headers.Authorization = `${token}`;
  console.log("Sending request with headers:", config.headers);
  return config;
});
