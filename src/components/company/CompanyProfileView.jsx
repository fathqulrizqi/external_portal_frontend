// Generic, prop-driven view for displaying company profile
import React from 'react';

/**
 * @param {object} props
 * @param {object} props.company - The company profile data
 * @param {function} [props.onEdit] - Edit callback
 * @param {function} [props.onDelete] - Delete callback
 */
export function CompanyProfileView({ company, onEdit, onDelete }) {
  if (!company) return <div>No company profile found.</div>;
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">{company.name}</h2>
      <div className="mb-1"><b>Address:</b> {company.address}</div>
      <div className="mb-1"><b>Email:</b> {company.email}</div>
      <div className="mb-1"><b>Phone:</b> {company.phone}</div>
      {/* Add more fields as needed */}
      <div className="mt-4 flex gap-2">
        {onEdit && <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={onEdit}>Edit</button>}
        {onDelete && <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={onDelete}>Delete</button>}
      </div>
    </div>
  );
}
