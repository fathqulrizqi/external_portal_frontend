import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import { getToken } from "../utils/cookies";

export default function useSidebarAuth() {
  const [sidebar, setSidebar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchSidebar = async () => {
      try {
        const { data } = await API.get("/user/sidebar"); 
        if (data?.status === "Success") {
          const roles = data.data?.roles || [];

          // navigasi sesuai role
          if (roles.includes("admin")) navigate("/admin/internal", { replace: true });
          else navigate("/admin/external", { replace: true });

          setSidebar(data.data);
        }
      } catch (err) {
        const status = err?.response?.status;
        const errors = err?.response?.data?.errors;

        if (status === 401 || errors === "Unauthorized") {
          navigate("/login", { replace: true });
        }

        if (status === 402 || errors === "Account is not active") {
          getToken();

        if (token) {
          try {
            await API.post(
              "/users/OTP",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.log("Failed to request OTP:", err);
          }
        }
          navigate("/register/otp", {
            replace: true,
            state: { msg: "Please verify your email through the OTP sent to your inbox." },
          });
        }

        if (status === 403 || errors === "Session Expired!!") {
        getToken();

        if (token) {
          try {
            await API.post(
              "/users/OTP",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.log("Failed to request OTP:", err);
          }
        }
        

  // baru redirect ke login OTP
  navigate("/login/otp", {
    replace: true,
    state: { msg: "Your session has expired. OTP has been sent to your email." },
  });
}

 if (status === 403 && errors === "New Device Detected/Session Device Expired. Please verify login via email.") {
        getToken();

        if (token) {
          try {
            await API.post(
              "/users/OTP",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.log("Failed to request OTP:", err);
          }
        }
        

  navigate("/login/otp", {
    replace: true,
    state: { msg: "Your session has expired. OTP has been sent to your email." },
  });
}

if (status === 500){
  alert("SERVER ERROR");
  navigate("/", {
    replace: true,
    state: { msg: "SERVER ERROR." },
  })
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
