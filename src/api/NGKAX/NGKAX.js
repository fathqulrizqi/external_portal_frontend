import { API } from ".."
// Fetch NGKAX SO numbers by PO number
export async function fetchNgkaxSONumbers(poNumber) {
  if (!poNumber) return '';
  try {
    const res = await API.get(`/NGKAX/d365-import-form-sales?poNumber=${encodeURIComponent(poNumber)}`);
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      const soNumbers = res.data.data.map(item => item.soNumber).filter(Boolean);
      return soNumbers.length > 0 ? soNumbers.join(', ') : '';
    }
    return '';
  } catch (err) {
    return '';
  }
}
