// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// export default function GuestOnly({ children }) {
//   const token = Cookies.get("token");

//   if (token) return <Navigate to="/admin/internal" replace />;

//   return children;
// }

import React from "react";
import { getToken } from "../utils/cookies";
import { navigateByRedirect } from "../utils/navigate";
import { getAppName, getRedirectName } from "../utils/location";
import { useNavigate } from "react-router-dom";

export default function GuestOnly({ children }) {
  // const token = getToken();
  // const role = JSON.parse(localStorage.getItem("role"));
  // const appName = getAppName();
  // const navigate = useNavigate();
  // const redirect = getRedirectName();

  // if (token){
  //   navigateByRedirect(role, navigate, appName, redirect)
  // }

  return children;
}

