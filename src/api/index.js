import axios from "axios";
import { getClientUUID } from "../utils/device";
const url = 'http://192.168.0.16:3001'

export const API = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const uuid = getClientUUID();
  if (uuid) {
    config.headers["Client-Device-Uuid"] = uuid;
  }
  return config;
});
