import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Image } from "primereact/image";

export function CompanyProfileView({ company, onEdit, onDelete }) {
  if (!company) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
          <p className="text-sm text-gray-600 mt-1">No company profile found</p>
        </div>

        <div className="flex justify-center">
          <Button
            label="Create Company Profile"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={onEdit}
          />
        </div>
      </div>
    );
  }

  const statusSeverity =
    {
      PT: "success",
      CV: "info",
      BUMN: "warning",
    }[company.companyStatus] || "secondary";

  const imageUrl = company.urlImage
    ? `${import.meta.env.VITE_API_BASE_URL}/images/Company/${company.urlImage}`
    : "https://asamco.com/wp-content/uploads/2021/02/company-icon-vector-isolated-white-background-company-transparent-sign-company-icon-vector-isolated-white-background-company-134078740.jpg";

  const labelClass = "block text-md font-medium text-gray-700 mb-2";

  return (
    <div className="w-full">
      {/* Header - Matches Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
        <p className="text-sm text-gray-600 mt-1">
          Company information and details
        </p>
      </div>

      {/* Company Image - Matches Form Layout */}
      <div className="mb-6">
        <label className={labelClass}>Company Image</label>
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
          <Image
            src={imageUrl}
            alt="Company Image"
            width="180"
            preview
            className="rounded"
          />
          <div className="flex flex-col gap-2">
            <Tag
              value={company.companyStatus}
              severity={statusSeverity}
              className="text-sm"
            />
            <span className="text-gray-700 font-medium uppercase">
              {company.companyType}
            </span>
          </div>
        </div>
      </div>

      {/* Company Information - Form-style Layout */}
      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label className={labelClass}>Company Name</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900 font-medium">
            {company.companyName}
          </div>
        </div>

        {/* Segments */}
        <div>
          <label className={labelClass}>Segments</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50">
            {company.segments?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {company.segments.map((s, i) => (
                  <Tag
                    key={i}
                    value={s.segmentName || `Segment ${s}`}
                    severity="secondary"
                    className="text-sm"
                    rounded
                  />
                ))}
              </div>
            ) : (
              <span className="text-gray-500">No segments selected</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900 font-medium">
            {company.otherStatus || company.companyStatus}
          </div>
        </div>

        {/* NPWP */}
        <div>
          <label className={labelClass}>NPWP</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900 font-mono">
            {company.npwp}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900">
            {company.companyAddress}
          </div>
        </div>

        {/* Phone/Fax */}
        <div>
          <label className={labelClass}>Phone / Fax</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900">
            {company.companyTelpFax || (
              <span className="text-gray-500">No Phone / Fax</span>
            )}
          </div>
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900">
            {company.companyCity}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50">
            <a
              href={`mailto:${company.companyEmail}`}
              className="text-primary font-medium no-underline hover:underline"
            >
              {company.companyEmail}
            </a>
          </div>
        </div>

        {/* Company Code */}
        <div>
          <label className={labelClass}>Company Code</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900 font-mono">
            {company.companyCode}
          </div>
        </div>

        {/* Application */}
        <div>
          <label className={labelClass}>Application</label>
          <div className="w-full p-3 border border-gray-200 rounded bg-gray-50 text-gray-900">
            {company.application}
          </div>
        </div>
      </div>

      {/* Actions - Matches Form Actions */}
      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
        <Button
          type="button"
          label="Edit"
          icon="pi pi-pencil"
          className="p-button-info"
          onClick={onEdit}
        />
        {onDelete && (
          <Button
            type="button"
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={onDelete}
          />
        )}
      </div>

      {/* Meta Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>ID: {company.companyId || "N/A"}</span>
          <div className="flex gap-4">
            <span>
              Created:{" "}
              {company.createdAt
                ? new Date(company.createdAt).toLocaleDateString("id-ID")
                : "-"}
            </span>
            <span>
              Last Update:{" "}
              {company.updatedAt
                ? new Date(company.updatedAt).toLocaleDateString("id-ID")
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
