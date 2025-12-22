// API for fetching company segments
import { API } from '../index.js';

export const getCompanySegments = async () => {
  const res = await API.get('/public/company-segments');
  return res.data?.data || [];
};