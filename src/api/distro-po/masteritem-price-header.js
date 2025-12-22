// API for fetching all submitted price list headers
import { API } from "../index";

export async function fetchAllMasterItemPriceHeaders() {
  const res = await API.get("/distro-po/masteritem-price-headers");
  if (res.data && Array.isArray(res.data)) return res.data;
  return [];
}
