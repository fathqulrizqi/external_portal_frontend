import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => cookies.set("token", token);
export const getToken = () => cookies.get("token");
export const removeToken = () => cookies.remove("token");

export const setRole = (role) => localStorage.setItem("role", JSON.stringify(role));
export const getRole = () => {
    const role = localStorage.getItem("role");
    return role ? JSON.parse(role) : null;
};
export const removeRole = () => localStorage.removeItem("role");