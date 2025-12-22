// React hook for company profile CRUD logic
import { useState, useCallback } from 'react';
import {
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  createCompanyProfile
} from '../../api/company';

export function useCompanyProfile(application) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCompanyProfile(application);
      setCompany(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setCompany(null); // No company profile yet
        setError(null);
      } else {
        setError('Failed to load company profile');
      }
    }
    setLoading(false);
  }, [application]);

  const saveProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (data.id) {
        res = await updateCompanyProfile(data.id, data, application);
      } else {
        res = await createCompanyProfile(data, application);
      }
      setCompany(res.data);
      return res.data;
    } catch (err) {
      setError('Failed to save company profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [application]);

  const removeProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCompanyProfile(id, application);
      setCompany(null);
    } catch (err) {
      setError('Failed to delete company profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [application]);

  return {
    company,
    loading,
    error,
    fetchProfile,
    saveProfile,
    removeProfile
  };
}
