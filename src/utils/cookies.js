import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => cookies.set("token", token, { path: "/" });
export const getToken = () => cookies.get("token");
export const removeToken = () => cookies.remove("token", { path: "/" });

export const setRole = (roleArray) =>
  cookies.set("role", JSON.stringify(roleArray), { path: "/" });

export const getRole = () => {
  const role = cookies.get("role");
  try {
    return JSON.parse(role);
  } catch {
    return [];
  }
};

export const removeRole = () =>
  cookies.remove("role", { path: "/" });
