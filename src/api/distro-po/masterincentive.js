import { API } from "../index";

export const getAllMasterIncentives = () => API.get("/distro-po/masterincentive");
export const getMasterIncentiveById = (id) => API.get(`/distro-po/masterincentive/${id}`);
export const createMasterIncentive = (data) => API.post("/distro-po/masterincentive", data);
export const updateMasterIncentive = (id, data) => API.put(`/distro-po/masterincentive/${id}`, data);
export const deleteMasterIncentive = (id) => API.delete(`/distro-po/masterincentive/${id}`);