import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function useSidebarAuth() {
  const [sidebar, setSidebar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const { data } = await API.post("/user/sidebar");

        setSidebar(data);

      } catch (err) {
        const status = err?.response?.status;

        if (status === 401) return navigate("/login");
        if (status === 402) return navigate("/register/otp");
        if (status === 403) return navigate("/login/otp");

        console.log("Sidebar error:", err);
      }
    };

    fetchSidebar();
  }, []);

  return sidebar;
}
