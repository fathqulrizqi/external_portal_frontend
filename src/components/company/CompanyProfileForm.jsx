// Generic, prop-driven form for editing/creating company profile

import React from 'react';
import Select from 'react-select';
import { getCompanySegments } from '../../api/company/segment';

/**
 * @param {object} props
 * @param {object} props.initialValues - Initial form values
 * @param {function} props.onSubmit - Submit handler
 * @param {function} [props.onCancel] - Cancel handler
 * @param {boolean} [props.loading] - Loading state
 */
export function CompanyProfileForm({ initialValues, onSubmit, onCancel, loading }) {
  const [form, setForm] = React.useState(initialValues || {});
  const [segmentOptions, setSegmentOptions] = React.useState([]);

  React.useEffect(() => {
    async function fetchSegments() {
      try {
        const segments = await getCompanySegments();
        setSegmentOptions(segments);
      } catch (err) {
        setSegmentOptions([]);
      }
    }
    fetchSegments();
  }, []);

  React.useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues]);

  const handleChange = (e) => {
    // For react-select, handle segments separately
    if (e && e.target === undefined && Array.isArray(e)) {
      // This is for react-select multi for segments
      setForm({ ...form, segments: e.map(opt => opt.value) });
      return;
    }
    const { name, value, type, multiple, options } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(options).filter(o => o.selected).map(o => Number(o.value));
      setForm({ ...form, [name]: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="block font-bold">Company Name</label>
        <input name="companyName" value={form.companyName || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" required />
      </div>
      {/* Founding Date is not in the Company model, so remove it */}
      <div>
        <label className="block font-bold">NPWP</label>
        <input name="npwp" value={form.npwp || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" required />
      </div>
      {/* Website is not in the Company model, so remove it */}
            <div>
              <label className="block font-bold">Company Code</label>
              <input name="companyCode" value={form.companyCode || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
            </div>
            <div>
              <label className="block font-bold">Company Type</label>
              <select
                name="companyType"
                value={form.companyType || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
                required
              >
                <option value="">Select type</option>
                <option value="vendor">Vendor</option>
                <option value="distributor">Distributor</option>
                <option value="consultant">Consultant</option>
                <option value="contractor">Contractor</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="supplier">Supplier</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold">City</label>
              <input name="companyCity" value={form.companyCity || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
            </div>
            {/* Image URL is optional and hidden for now */}
            <input type="hidden" name="urlImage" value={form.urlImage || ''} />
      <div>
        <label className="block font-bold">Segments</label>
        <Select
          isMulti
          name="segments"
          options={segmentOptions.map(seg => ({ value: seg.segmentId, label: seg.segmentName }))}
          value={
            (form.segments || []).map(segId => {
              const seg = segmentOptions.find(s => s.segmentId === segId);
              return seg ? { value: seg.segmentId, label: seg.segmentName } : null;
            }).filter(Boolean)
          }
          onChange={handleChange}
          classNamePrefix="react-select"
          className="w-full"
          isClearable={false}
          required
        />
      </div>
      <div>
        <label className="block font-bold">Address</label>
        <input name="companyAddress" value={form.companyAddress || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" required />
      </div>
      <div>
        <label className="block font-bold">Email</label>
        <input name="companyEmail" value={form.companyEmail || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" type="email" required />
      </div>
      <div>
        <label className="block font-bold">Phone/Fax</label>
        <input name="companyTelpFax" value={form.companyTelpFax || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" required />
      </div>      
      <div>
        <label className="block font-bold">Status</label>
        <select
          name="companyStatus"
          value={form.companyStatus || ''}
          onChange={handleChange}
          className="border px-2 py-1 rounded w-full"
          required
        >
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      {/* Add more fields as needed */}
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" className="bg-gray-400 text-black px-4 py-1 rounded" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
