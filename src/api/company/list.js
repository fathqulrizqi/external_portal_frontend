import { API } from "../index";

// Fetch all companies for dropdowns, etc.
export const getAllCompanies = (application = 'External-Portal') => API.get(`/company?application=${application}`);
