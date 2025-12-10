import { Navigate, useLocation } from "react-router-dom";
import useSidebarAuth from "../hooks/useSidebarAuth";

export default function RequireAuth({ children }) {
  const { sidebar, loading, errorCode, errorMessage } = useSidebarAuth();
  const location = useLocation();

  const appName = location.pathname.split("/")[1] || "";

  if (loading) return <p>Loading...</p>;

  if (!sidebar) {
    // 402 → belum aktif → register OTP
      if (errorCode === 402 || errorMessage === "Account is not active") {
    return (
      <Navigate
        to={`/${appName}/register-otp`}
        replace
        state={{
          msg: "Email has been sent to your email.",
          appName,
          reason: errorMessage,
        }}
      />
    );
  }

    // 403 → login OTP
    if (errorCode === 403) {
      return <Navigate to={`/${appName}/login-otp`} replace />;
    }

    // 401 → login biasa
    if (errorCode === 401) {
      return <Navigate to={`/${appName}/login`} replace />;
    }

    // fallback
    return <Navigate to={`/${appName}/login`} replace />;
  }

  return children;
}
