import { API } from "../index";

export const getProfile = async () => {
  try {
    const response = await API.get("/users/profile");
    return { 
      success: true, 
      data: response.data.data, 
      message: response.data.message 
    };
  } catch (err) {
    const msg = err.response?.data?.message 
      || err.response?.data?.errors 
      || "Failed retrieving sidebar";

    return { 
      success: false, 
      data: [], 
      message: msg 
    };
  }
};
export const updateProfile = async (data) => {
  try {
    const response = await API.patch("/users/profile", data); 
    return { 
      success: true, 
      data: response.data.data, 
      message: response.data.message 
    };
  } catch (err) {
    const msg = err.response?.data?.message || "Update failed";
    return { success: false, message: msg };
  }
};


