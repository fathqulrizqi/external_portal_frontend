import React from "react";
import { getCompanySegments } from "../../api/company/segment";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
export function CompanyProfileForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = React.useState(initialValues || {});
  const [segmentOptions, setSegmentOptions] = React.useState([]);

  React.useEffect(() => {
    async function fetchSegments() {
      try {
        const segments = await getCompanySegments();
        setSegmentOptions(
          segments.map((s) => ({
            label: s.segmentName,
            value: s.segmentId,
          }))
        );
      } catch {
        setSegmentOptions([]);
      }
    }
    fetchSegments();
  }, []);

  React.useEffect(() => {
    setForm(initialValues || {});
  }, [initialValues]);

  /* ===============================
     HANDLERS
  =============================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name, e) => {
    setForm((prev) => ({ ...prev, [name]: e.value }));
  };

  const handleMultiSelectChange = (e) => {
    setForm((prev) => ({ ...prev, segments: e.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  /* ===============================
     STYLES
  =============================== */
  const labelClass = "block text-md font-medium text-gray-700 mb-2";

  /* ===============================
     OPTIONS
  =============================== */
  const companyTypeOptions = [
    { label: "Vendor", value: "vendor" },
    { label: "Distributor", value: "distributor" },
    { label: "Consultant", value: "consultant" },
    { label: "Contractor", value: "contractor" },
    { label: "Manufacturer", value: "manufacturer" },
    { label: "Supplier", value: "supplier" },
    { label: "Other", value: "other" },
  ];

  const statusOptions = [
    { label: "PT", value: "PT" },
    { label: "CV", value: "CV" },
    { label: "BUMN", value: "BUMN" },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please complete the fields below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className={labelClass}>
            Company Name <span className="text-red-500">*</span>
          </label>
          <InputText
            name="companyName"
            value={form.companyName || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* NPWP */}
        <div>
          <label className={labelClass}>
            NPWP <span className="text-red-500">*</span>
          </label>
          <InputText
            name="npwp"
            value={form.npwp || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Company Code */}
        <div>
          <label className={labelClass}>Company Code</label>
          <InputText
            name="companyCode"
            value={form.companyCode || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
          />
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <InputText
            name="companyCity"
            value={form.companyCity || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
          />
        </div>

        {/* Founding Date */}
         <div>
      <label className="block text-md font-medium text-gray-700 mb-2">
        Founding Date
      </label>

      <Calendar
       value={form.companyFoundingDate || ""}
            onChange={handleInputChange}
        dateFormat="dd/mm/yy"
        showIcon  
        className="w-full"
        placeholder="Select founding date"
      />
    </div>

        {/* Segments */}
        <div>
          <label className={labelClass}>
            Segments <span className="text-red-500">*</span>
          </label>
          <MultiSelect
            value={form.segments || []}
            options={segmentOptions}
            onChange={handleMultiSelectChange}
            placeholder="Select Segments"
            display="chip"
            maxSelectedLabels={3}
            className="w-full p-inputtext-sm text-sm"
          />
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>
            Address <span className="text-red-500">*</span>
          </label>
          <InputText
            name="companyAddress"
            value={form.companyAddress || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <InputText
            type="email"
            name="companyEmail"
            value={form.companyEmail || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            Phone / Fax <span className="text-red-500">*</span>
          </label>
          <InputText
            name="companyTelpFax"
            keyfilter="int"
            value={form.companyTelpFax || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>
            Status <span className="text-red-500">*</span>
          </label>

          {/* GROUP RADIO PT / CV / BUMN */}
          <div className="flex flex-column gap-6 mt-2">
            {statusOptions.map((opt) => (
              <div key={opt.value} className="flex align-items-center gap-2">
                <RadioButton
                  inputId={opt.value}
                  name="companyStatus"
                  value={opt.value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      companyStatus: e.value,
                      otherStatus: "",
                    }))
                  }
                  checked={form.companyStatus === opt.value}
                />
                <label htmlFor={opt.value}>{opt.label}</label>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-3 mt-3">
            <div className="flex items-center gap-2">
              <RadioButton
                inputId="OTHER"
                name="companyStatus"
                value="OTHER"
                onChange={() =>
                  setForm((prev) => ({ ...prev, companyStatus: "OTHER" }))
                }
                checked={form.companyStatus === "OTHER"}
              />
              <label htmlFor="OTHER">Other</label>
            </div>

            <InputText
              value={form.otherStatus || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, otherStatus: e.target.value }))
              }
              placeholder="Enter Status ..."
              className="w-48 p-inputtext-sm"
              disabled={form.companyStatus !== "OTHER"}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
