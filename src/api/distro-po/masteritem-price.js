import { API } from "../index";
// API for fetching latest item price for a customer
export async function fetchLatestItemPrice(itemId, customerCode) {
  try {
    const res = await API.get(`/distro-po/masteritem-price?itemId=${encodeURIComponent(itemId)}&customerCode=${encodeURIComponent(customerCode)}`);
    // Axios returns data directly on res.data
    const data = res.data || res;
    if (data && typeof data.price === 'number') return data.price;
  } catch (e) {}
  return null;
}
