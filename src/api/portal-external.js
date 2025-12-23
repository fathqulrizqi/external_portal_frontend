import { API } from ".";

export const getSidebar = async () => {
  try {
    const response = await API.get("/users/sidebar");

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


