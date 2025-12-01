import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => cookies.set("token", token, { path: "/" });
export const getToken = () => cookies.get("token");
export const removeToken = () => cookies.remove("token", { path: "/" });
