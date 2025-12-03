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
  removeToken(); 
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userInfo");
  console.log("User logged out successfully");
};


export const register = async ({ fullName, email, password, passwordConfirm, phone }) => {
  try {
    const res = await API.post("/users/register", {
      fullName,
      email,
      password,
      passwordConfirm,
      phone
    });

    // auto-login
    const loginRes = await API.post("/users/login", { email, password });
    const { token, role } = loginRes.data.data;

    setToken(token);
    localStorage.setItem("role", JSON.stringify(role));

    return { success: true, message: "registered-and-logged-in" };

  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Login failed";

    // tandai kalau invalid credentials
    if (err.response?.status === 500 && msg === "Email already registered") {
      return { success: false, message: "redirect-login" };
    }
    console.log(err);
    return { success: false, message: err.response?.data?.message || "Failed" };
  }
};


export const OTPRegistrationVerification = async ({ otp }) => {
  try {
    const token = getToken();

    const { data } = await API.post(
      "/users/OTPVerification",
      { otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const isSuccess = data?.status === "Success" || data?.success === true;

    return {
      success: isSuccess,
      message: data?.message || null,
      raw: data,
    };
  } catch (err) {
    return {
      success: false,
      message: "Verification failed",
      raw: err,
    };
  }
};

