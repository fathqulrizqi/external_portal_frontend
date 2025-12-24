
import React from "react";
import { getCompanySegments } from "../../api/company/segment";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { groupedCities } from "../../utils/constants/company";
import { getAppName } from "../../utils/location";
import { createCompanyProfile, updateCompanyProfile } from "../../api/company";
import { useNavigate } from "react-router-dom";
import { navigateCompanyProfile } from "../../utils/navigate";

export function CompanyProfileForm({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) {
  const [form, setForm] = React.useState(initialValues || {});
  const [segmentOptions, setSegmentOptions] = React.useState([]);
  const DEFAULT_IMAGE =
    "https://asamco.com/wp-content/uploads/2021/02/company-icon-vector-isolated-white-background-company-transparent-sign-company-icon-vector-isolated-white-background-company-134078740.jpg";

  const [imagePreview, setImagePreview] = React.useState(
    initialValues?.companyImageUrl || DEFAULT_IMAGE
  );
  const fileUploadRef = React.useRef(null);
  const [fileName, setFileName] = React.useState("");
  const appName = getAppName(); 
  const navigate = useNavigate();

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

  const handleMultiSelectChange = (e) => {
    setForm((prev) => ({ ...prev, segments: e.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const dataToSend = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key !== "companyImage") {
      if (Array.isArray(value)) {
        value.forEach(v => dataToSend.append(key, v));
      } else if (value !== null && value !== undefined) {
        dataToSend.append(key, value);
      }
    }
  });

  dataToSend.append("companyType", "Distributor");
  dataToSend.append("application", appName);
  dataToSend.append("companyCode", "a");

  // Handling Image
if (form.companyImage instanceof File) {
  dataToSend.append("companyImage", form.companyImage);
} else if (!form.id) {
  const dummyFile = new File([new Uint8Array([0x00])], "empty.jpg", { type: "image/jpeg" });
  dataToSend.append("companyImage", dummyFile);
}
try {
  let result;
  if (form.companyId) { 
    result = await updateCompanyProfile(dataToSend, "Company");
    //  if (result.success) {
    
    //     navigateCompanyProfile(navigate, appName);
    
    // }

  } else {
    result = await createCompanyProfile(dataToSend, "Company");

    // if (result.success) {
    
    //     navigateCompanyProfile(navigate, appName);
    
    // }

  }
  if (onSubmit) onSubmit(result);
} catch (error) {
  console.error(error);
}
};

  const onSelectImage = (e) => {
    const file = e.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image allowed");
      return;
    }

    if (file.size > 2_000_000) {
      alert("Max file size 2MB");
      return;
    }

    setForm((prev) => ({
      ...prev,
      companyImage: file,
    }));

    setImagePreview(URL.createObjectURL(file));
    setFileName(file.name); // \u2705 SIMPAN NAMA FILE

    // supaya bisa pilih ulang
    fileUploadRef.current?.clear();
  };

  /* ===============================
     STYLES
  =============================== */
  const labelClass = "block text-md font-medium text-gray-700 mb-2";
  const asterisk = <span className="text-red-500">*</span>;
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
        {/* Company Image */}
        <div>
          <label className={labelClass}>Company Image</label>

          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
            {/* Preview */}
            <Image
              src={imagePreview}
              alt="Company Image"
              width="180"
              preview
              className="rounded"
            />

            {/* Upload */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <FileUpload
                ref={fileUploadRef}
                mode="basic"
                accept="image/*"
                maxFileSize={2000000}
                customUpload
                auto={false}
                chooseLabel="Upload Image"
                onSelect={onSelectImage}
                className="p-button-sm"
              />
              <small className="text-gray-500">
                {fileName || "No file selected"}
              </small>

              <small className="text-gray-500">JPG / PNG, max 2MB</small>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className={labelClass}>Company Name {asterisk}</label>
          <InputText
            name="companyName"
            value={form.companyName || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Segments */}
        <div>
          <label className={labelClass}>Segments {asterisk}</label>
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

        {/* Status */}
        <div>
          <label className={labelClass}>Status {asterisk}</label>

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

        {/* NPWP */}
        <div>
          <label className={labelClass}>NPWP {asterisk}</label>
          <InputText
            name="npwp"
            value={form.npwp || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address {asterisk}</label>
          <InputText
            name="companyAddress"
            value={form.companyAddress || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm text-sm"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone / Fax {asterisk}</label>
          <InputText
            name="companyTelpFax"
            keyfilter="int"
            value={form.companyTelpFax || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City {asterisk}</label>

          <Dropdown
            value={form.companyCity || null}
            options={groupedCities}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, companyCity: e.value }))
            }
            optionGroupLabel="label"
            optionGroupChildren="items"
            optionLabel="label"
            filter
            showClear
            placeholder="Select City"
            className="w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email {asterisk}</label>
          <InputText
            type="email"
            name="companyEmail"
            value={form.companyEmail || ""}
            onChange={handleInputChange}
            className="w-full p-inputtext-sm"
            required
          />
        </div>

        {/* Company Code (Hidden - Auto-generated) */}
        <input type="hidden" name="companyCode" value={form.companyCode || "a"} />

        {/* Application (Hidden - Auto-generated) */}
        <input type="hidden" name="application" value={form.application || appName} />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            label={loading ? "Saving..." : "Save"}
            icon="pi pi-check"
            loading={loading}
            className="p-button-success"
          />

          {onCancel && (
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={onCancel}
            />
          )}
        </div>
      </form>
    </div>
  );
}
