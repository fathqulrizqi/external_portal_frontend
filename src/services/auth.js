import { API } from "../api";
import { getClientUUID } from "../utils/device";
import Cookies from "universal-cookie";


export const login = async ({ email, password }) => {
  try {
    const response = await API.post("/users/login", { email, password });
    const user = response.data.data;

   const cookies = new Cookies();
   cookies.set("token", user.token, { path: "/" });

    console.log("Token yang disimpan:", cookies.get("token"));


    return {
      success: true,
      message: response.data.message,
    };

  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed"
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
