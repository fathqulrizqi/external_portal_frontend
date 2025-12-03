import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => cookies.set("token", token);
export const getToken = () => cookies.get("token");
export const removeToken = () => cookies.remove("token");

export const setRole = (role) => cookies.set("role", role);
export const getRole = () => cookies.get("role");
export const removeRole = () => cookies.remove("role");