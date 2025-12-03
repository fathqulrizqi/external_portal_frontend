import { useNavigate } from "react-router-dom";

export function navigateByRole(roles, navigate) {
  if (!roles || roles.length === 0) {
    navigate("/", { replace: true });
    return;
  }

  if (roles.includes("admin")) {
    navigate("/admin/internal", { replace: true });
  } else if (roles.includes("user")) {
    navigate("/admin/external", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
}
