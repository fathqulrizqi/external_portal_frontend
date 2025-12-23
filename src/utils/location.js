import { useLocation } from "react-router-dom";

function getAppSegment(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] || "public";
}

export function getbasePath() {
  const { pathname } = useLocation();
  return `/${getAppSegment(pathname)}`;
}

export function getAppName() {
  const { pathname } = useLocation();
  return getAppSegment(pathname);
}
