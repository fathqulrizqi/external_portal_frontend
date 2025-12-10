import { API } from "..";
import axios from "axios";

const BASE = "/distro-po/masteritem";

export const getMasterItems = () => API.get(BASE).then(r => r.data);
export const createMasterItem = (data) => API.post(BASE, data).then(r => r.data);
export const updateMasterItem = (id, data) => API.put(`${BASE}/${id}`, data).then(r => r.data);
export const deleteMasterItem = (id) => API.delete(`${BASE}/${id}`).then(r => r.data);