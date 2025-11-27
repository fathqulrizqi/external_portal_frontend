import { API } from "../api";
import { getClientUUID } from "../utils/device";

export const login = async ({ email, password }) => {
  try {
    const uuid = getClientUUID(); 

    const response = await API.post("users/login", 
      { email, password },
      {
        headers: { "Client-Device-Uuid": uuid },
        withCredentials: true,
      }
    );

    const data = response.data;

    return {
      success: true,
      message: data.message
    };

  } catch (err) {
    console.log("Login error:", err);

    const msg = err.response?.data?.message || "Login failed";

    return {
      success: false,
      message: msg
    };
  }
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

export const logout = () => {
  try {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userInfo");
  } catch (err) {
    console.log(err);
  }
};
