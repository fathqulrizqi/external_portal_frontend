import { API } from "..";
// Save Distributor PO (header + items)
export const saveDistributorPO = async (headerInfo, items) => {
  try {
    // Ensure poDate is ISO string
    let poDate = headerInfo.poDate;
    if (poDate && !poDate.includes('T')) {
      poDate = new Date(poDate).toISOString();
    }
    // Compose payload for backend
    const payload = {
      header: {
        ...headerInfo,
        customerCode: headerInfo.custCode, // Map custCode to customerCode
        poDate,
      },
      items: items.map(({ id, category, type, ...rest }) => ({
        vehicleCategory: category,
        spType: type,
        ...rest
      })), // Map fields for backend
    };
    delete payload.header.custCode; // Remove custCode
    // Adjust endpoint if needed
    const response = await API.post("/distro-po", payload);
    return {
      success: true,
      data: response.data,
      message: response.data.message || "PO saved successfully"
    };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Failed to save PO";
    return {
      success: false,
      data: null,
      message: msg
    };
  }
};

// Fetch all Distributor POs
export const getAllDistributorPOs = async () => {
  try {
    const response = await API.get("/distro-po");
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Fetched successfully"
    };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Failed to fetch POs";
    return {
      success: false,
      data: [],
      message: msg
    };
  }
};