// Fetch PO Summary (by year and optional month)
export const getPOSummary = async ({ year, month }) => {
  try {
    let url = `/distro-po/summary?year=${year}`;
    if (month !== undefined && month !== null) url += `&month=${month}`;
    const response = await API.get(url);
    // Always return array of summary objects with vehicle category fields
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  } catch (err) {
    return [];
  }
};
// Update Distributor PO by ID
export const updateDistributorPO = async (id, headerInfo, items) => {
  try {
    let poDate = headerInfo.poDate;
    if (poDate && !poDate.includes('T')) {
      poDate = new Date(poDate).toISOString();
    }
    const payload = {
      header: {
        ...headerInfo,
        customerCode: headerInfo.custCode,
        poDate,
        niterraSO: headerInfo.niterraSO,
      },
      items: items.map(({ id, category, vehicle, vehicleId, price, type, ...rest }) => ({
        category,
        vehicleId,
        vehicle,
        price,
        spType: type,
        ...rest
      })),
    };
    delete payload.header.custCode;
    const response = await API.put(`/distro-po/${id}`, payload);
    return {
      success: true,
      data: response.data,
      message: response.data.message || "PO updated successfully"
    };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Failed to update PO";
    return {
      success: false,
      data: null,
      message: msg
    };
  }
};
// Fetch single Distributor PO by ID
export const getDistributorPOById = async (id) => {
  try {
      const response = await API.get(`/distro-po/${id}`); // No change needed here
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Fetched successfully"
    };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.errors || "Failed to fetch PO";
    return {
      success: false,
      data: null,
      message: msg
    };
  }
};
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
        niterraSO: headerInfo.niterraSO,
      },
      items: items.map(({ id, category, vehicle, vehicleId, price, type, ...rest }) => ({
        category,
        vehicleId,
        vehicle,
        price,
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