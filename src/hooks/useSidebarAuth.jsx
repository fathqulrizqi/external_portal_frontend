import { useEffect, useState } from "react";
import { getSidebar } from "../api/sidebar"; 
import { getToken } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import { getAppName } from "../utils/location";

export default function useSidebarAuth() {
  const [sidebar, setSidebar] = useState(null); // Mulai dengan null
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    const fetchSidebar = async () => {
      const res = await getSidebar();

      if (res.success) {
        setSidebar(res.data);
      } else {
        // Simpan pesan error dan code-nya
        setErrorMessage(res.message);
        setErrorCode(res.status); // Pastikan api/sidebar me-return status code
        
        // JANGAN navigate ke register-otp di sini jika dashboard public
        setSidebar([]); // Set sidebar kosong saja agar tidak dianggap "null/loading"
      }
      setLoading(false);
    };

    fetchSidebar();
  }, []);

  return { sidebar, loading, errorMessage, errorCode };
}
