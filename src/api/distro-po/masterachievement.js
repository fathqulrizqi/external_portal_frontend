import { API } from "..";

export const getAllMasterAchievements = () => API.get('/distro-po/MasterAchievement');
export const getMasterAchievementById = (id) => API.get(`/distro-po/MasterAchievement/${id}`);
export const createMasterAchievement = (data) => API.post('/distro-po/MasterAchievement', data);
export const updateMasterAchievement = (id, data) => API.put(`/distro-po/MasterAchievement/${id}`, data);
export const deleteMasterAchievement = (id) => API.delete(`/distro-po/MasterAchievement/${id}`);