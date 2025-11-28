import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function useSidebarAuth() {
  const [sidebar, setSidebar] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const cookies = new Cookies();

 useEffect(() => {
    const token = cookies.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSidebar = async () => {
      try {
        const { data } = await API.post("/user/sidebar");
        
        const roles = data?.roles || [];

        if (roles.includes("admin")) navigate("/admin/internal");
        else if (roles.includes("vendor")) navigate("/admin/external");
        else navigate("/");

        setSidebar(data);
      } catch (err) {
        const status = err?.response?.status;

        if (status === 401) {
          navigate("/login");
        }

        if (status === 402) {
          await API.post("/users/OTP");
          navigate("/register/otp", {
            state: {
              msg: "Please verify your email through the OTP sent to your inbox."
            }
          });
        }

        if (status === 403) {
          await API.post("/users/OTP");
          navigate("/login/otp", {
            state: {
              msg: "Your session has been expired. A new OTP has been sent. Please verify to continue."
            }
          });
        }

        console.log("Sidebar error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebar();
  }, []);

  return { sidebar, loading };
}
