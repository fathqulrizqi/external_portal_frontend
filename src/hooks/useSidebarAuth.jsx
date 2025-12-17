import { useEffect, useState } from "react";
import { API } from "../api";
import { getToken } from "../utils/cookies";

export default function useSidebarAuth() {
  console.log(getToken());
  const [sidebar, setSidebar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      ErrorCode(401);
      setLoading(false);
      return;
    }

    const fetchSidebar = async () => {
      try {
        const { data } = await API.get("/user/sidebar");

        if (data?.status === "Success") {
          setSidebar(data.data);
        }
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.errors;

        setErrorCode(status);
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebar();
  }, []);

  return { sidebar, loading, errorCode, errorMessage };
}
