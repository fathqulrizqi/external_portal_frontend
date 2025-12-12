// src/services/auth.js
import { API } from ".";
import { setToken, removeToken, removeRole, getToken } from "../utils/cookies";

// src/services/auth.js
export const login = async ({ email, password, application }) => {
  try {
    const response = await API.post("/users/login", { email, password, application });
    const { token, role } = response.data.data;

    setToken(token);
    localStorage.setItem("role", JSON.stringify(role));

    return { success: true, message: response.data.message };

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors ||
      "Login failed";

    // credentials salah
    if (err.response?.status === 401 && msg === "Invalid email or password") {
      return { success: false, message: "redirect-login" };
    }

    // akun belum dibuat
    if (err.response?.status === 404 && msg === "You don't have an account,please register!!") {
      return { success: false, message: "redirect-register" };
    }

    // akun ada tapi belum OTP verify
    if (msg === "Account is not active") {
      return { success: false, message: "redirect-register-otp" };
    }

    return { success: false, message: msg };
  }
};

export const resetPassword = async ( email ) => {
  try {
    const response = await API.post("/forgotPasswordSendingEmail", { email });

    return { success: true, message: response.data.message };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Login failed";

     if (err.response?.status === 500 ) {
      return { success: false, message: "error-alert" };
    }
    return { success: false, message: msg };
  }
};

export const logout = () => {
  removeToken(); 
  removeRole();
  localStorage.removeItem("role");
  alert("Logout Successfully!")
};

export const resetPasswordConfirmation = async (password, passwordConfirm, token) => {
  try {
    if (!token) {
      return { success: false, message: "Invalid or missing token" };
    }

    const response = await API.post(
      `/forgotPassword?token=${token}`,
      { password, passwordConfirm }
    );

    return { success: true, message: response.data.message };

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors ||
      "Request failed";

    if (err.response?.status === 500) {
      return { success: false, message: "error-alert" };
    }

    return { success: false, message: msg };
  }
};


export const register = async ({ fullName, email, password, passwordConfirm, phone, application }) => {
  try {
    await API.post("/users/register", {
      fullName,
      email,
      password,
      passwordConfirm,
      phone,
      application
    });

    return { success: true, message: "registered" };

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errors ||
      "Registration failed";

    if (err.response?.status === 500 && msg === "Email already registered") {
      return { success: false, message: "redirect-login" };
    }

    return { success: false, message: msg };
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
          Authorization: `${token}`,
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

