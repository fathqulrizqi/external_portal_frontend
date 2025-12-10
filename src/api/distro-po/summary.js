// API for PO summary by distributor, vehicleID, monthly/yearly
import { API } from "..";

export const getPOSummary = async ({ year, month }) => {
  // year: required, month: optional
  let url = `/distro-po/summary?year=${year}`;
  if (month) url += `&month=${month}`;
  const response = await API.get(url);
  return response.data;
};
