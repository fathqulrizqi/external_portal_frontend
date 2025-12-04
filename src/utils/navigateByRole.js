import { useNavigate } from "react-router-dom";

export function navigateByRole(role, navigate) {
  if (!role || role.length === 0) {
    navigate("/", { replace: true });
    return;
  }

  if (role.includes("admin")) {
    navigate("/external-portal", { replace: true });
  } else if (role.includes("user")) {
    navigate("/external-portal", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
}
