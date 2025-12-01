// src/services/auth.js
import { API } from "../api";
import { setToken, removeToken } from "../utils/cookies";

// src/services/auth.js
export const login = async ({ email, password }) => {
  try {
    const response = await API.post("/users/login", { email, password });
    const { token, role } = response.data.data;

    setToken(token);
    localStorage.setItem("role", JSON.stringify(role));

    return { success: true, message: response.data.message };
  } catch (err) {
    // cek error di key 'message' atau 'errors'
    const msg = err.response?.data?.message || err.response?.data?.errors || "Login failed";

    // tandai kalau invalid credentials
    if (err.response?.status === 401 && msg === "Invalid email or password") {
      return { success: false, message: "redirect-register" };
    }

    return { success: false, message: msg };
  }
};

export const logout = () => {
  removeToken(); // hapus token
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userInfo");
  console.log("User logged out successfully");
};


export const register = async ({ fullName, email, password, passwordConfirm, phone }) => {
  try {
    const { data } = await API.post("/users/register", {
      fullName,
      email,
      password,
      passwordConfirm,
      phone
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

