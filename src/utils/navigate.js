import { useLocation, useNavigate } from "react-router-dom";
export function navigateByRole(role, navigate, appName) {
  
  if (!role) {
    navigate(`/${appName}/login`, { replace: true });
    return;
  }

  navigate(`/${appName}/dashboard`, { replace: true });
}

export function navigateCompanyProfile(navigate, appName){
  if (!role) {
    navigate(`/${appName}/login`, { replace: true });
    return;
  }

  navigate(`/${appName}/dashboard/company-profile`, { replace: true });

}

export function navigateByRedirect(role, navigate, appName, redirect) {
  
  if (!role) {
    navigate(`/${appName}/${redirect}`, { replace: true });
    return;
  }

  navigate(`/${appName}/dashboard`, { replace: true });
}