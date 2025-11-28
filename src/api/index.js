import axios from "axios";
import { getClientUUID } from "../utils/device";
import Cookies from "universal-cookie";

const url = 'http://192.168.0.16:3001'

export const API = axios.create({
  baseURL: `${url}/api`,

});

API.interceptors.request.use((config) => {
  const uuid = getClientUUID();
  const cookies = new Cookies();
  const token = cookies.get("token");

  console.log("TOKEN SENT:", token);
  if (uuid) {
    config.headers["Client-Device-Uuid"] = uuid;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
