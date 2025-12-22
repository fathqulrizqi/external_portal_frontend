// Centralized API logic for Company Profile
// Supports dynamic base URL via environment or parameter
import axios from 'axios';

const getBaseUrl = (application) => {
  // Use env or parameter for multi-app support
  return process.env.VITE_API_URL || `/api/company?application=${application || ''}`;
};

export const getCompanyProfile = async (application) => {
  const url = getBaseUrl(application);
  return axios.get(url);
};

export const updateCompanyProfile = async (id, data, application) => {
  const url = `${getBaseUrl(application)}/${id}`;
  return axios.put(url, data);
};

export const deleteCompanyProfile = async (id, application) => {
  const url = `${getBaseUrl(application)}/${id}`;
  return axios.delete(url);
};

export const createCompanyProfile = async (data, application) => {
  const url = getBaseUrl(application);
  return axios.post(url, data);
};
