
import React, { useEffect, useState } from 'react';
import { CompanyProfileView } from '../../components/company/CompanyProfileView';
import { CompanyProfileForm } from '../../components/company/CompanyProfileForm';
import { useCompanyProfile } from '../../hooks/company/useCompanyProfile';

export default function CompanyProfilePage() {
  const { company, loading, error, fetchProfile, saveProfile } = useCompanyProfile();
  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = () => {
    setEditing(true);
    setFormError(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormError(null);
  };

  const handleSubmit = async (data) => {
    // Simple validation example (match backend fields)
    if (!data.companyName || !data.companyEmail) {
      setFormError('Company Name and Email are required.');
      return;
    }
    try {
      await saveProfile(data);
      setEditing(false);
      setFormError(null);
    } catch (e) {
      setFormError('Failed to save company profile.');
    }
  };

  if (loading) return <div>Loading...</div>;

  // Only show error if not in create mode and not a 404 (handled in hook)
  if (error && company) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      {editing || !company ? (
        <>
          {formError && <div className="text-red-600 mb-2">{formError}</div>}
          <CompanyProfileForm
            initialValues={company || {}}
            onSubmit={handleSubmit}
            onCancel={company ? handleCancel : undefined}
            loading={loading}
          />
        </>
      ) : (
        <CompanyProfileView company={company} onEdit={handleEdit} />
      )}
    </div>
  );
}
