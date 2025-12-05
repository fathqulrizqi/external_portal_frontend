import { useNavigate } from "react-router-dom";

export function navigateByRole(role, navigate) {
  if (!role || role.length === 0) {
    navigate("/", { replace: true });
    return;
  }

  if (role !== null) {
    navigate("/external-portal", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
}
