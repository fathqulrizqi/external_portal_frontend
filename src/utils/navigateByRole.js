import { useLocation } from "react-router-dom";

export function navigateByRole(role, navigate, appName) {
  
  if (!role) {
    navigate(`/${appName}/login`, { replace: true });
    return;
  }

  navigate(`/${appName}/dashboard`, { replace: true });
}
