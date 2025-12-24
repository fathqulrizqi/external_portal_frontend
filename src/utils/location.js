import { useLocation } from "react-router-dom";

function getAppSegment(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] || "public";
}

function getAppRedirect(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[1] || "login";
}

export function getbasePath() {
  const { pathname } = useLocation();
  return `/${getAppSegment(pathname)}`;
}

export function getAppName() {
  const { pathname } = useLocation();
  return getAppSegment(pathname);
}

export function getRedirectName() {
  const { pathname } = useLocation();
  return getAppRedirect(pathname);
}
