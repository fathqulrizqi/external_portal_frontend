import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Fieldset } from 'primereact/fieldset';

/**
 * Company Profile View Component with PrimeReact styling
 * @param {object} props
 * @param {object} props.company - The company profile data
 * @param {function} [props.onEdit] - Edit callback
 * @param {function} [props.onDelete] - Delete callback
 */
export function CompanyProfileView({ company, onEdit, onDelete }) {
  if (!company) {
    return (
      <Card>
        <div className="text-center p-6">
          <i className="pi pi-building text-6xl text-400 mb-4"></i>
          <p className="text-xl text-600 mb-4">No company profile found.</p>
          <Button 
            label="Create Company Profile" 
            icon="pi pi-plus" 
            className="p-button-outlined"
            onClick={onEdit}
          />
        </div>
      </Card>
    );
  }

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'blacklisted': return 'danger';
      case 'pending': return 'warning';
      case 'suspended': return 'info';
      default: return 'secondary';
    }
  };

  const getCompanyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'vendor': return 'pi pi-shopping-cart';
      case 'distributor': return 'pi pi-truck';
      case 'consultant': return 'pi pi-briefcase';
      case 'contractor': return 'pi pi-hammer';
      case 'manufacturer': return 'pi pi-cog';
      case 'supplier': return 'pi pi-box';
      default: return 'pi pi-building';
    }
  };

  const header = (
    <div className="flex align-items-center gap-3">
      <Avatar 
        icon="pi pi-building" 
        size="large" 
        className="bg-blue-500 text-white"
      />
      <div>
        <h2 className="text-2xl font-bold text-900 m-0">{company.companyName || company.name || 'Unnamed Company'}</h2>
        <div className="flex align-items-center gap-2 mt-1">
          <i className={`pi ${getCompanyTypeIcon(company.companyType)} text-sm text-600`}></i>
          <span className="text-sm text-600 capitalize">{company.companyType || 'Unknown Type'}</span>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex gap-2">
      {onEdit && (
        <Button 
          icon="pi pi-pencil" 
          label="Edit Profile" 
          onClick={onEdit}
          className="p-button-outlined"
        />
      )}
      {onDelete && (
        <Button 
          icon="pi pi-trash" 
          label="Delete" 
          onClick={onDelete}
          className="p-button-outlined p-button-danger"
        />
      )}
    </div>
  );

  return (
    <Card header={header} footer={footer} className="shadow-2">
      <div className="grid">
        {/* Status Badge */}
        <div className="col-12">
          <div className="flex justify-content-end mb-3">
            <Tag 
              value={company.companyStatus || 'Unknown'} 
              severity={getStatusSeverity(company.companyStatus)}
              className="text-uppercase"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="col-12 md:col-6">
          <Fieldset legend="Company Information" className="mb-4">
            <div className="space-y-3">
              {company.companyCode && (
                <div className="flex justify-content-between">
                  <span className="text-600 font-medium">Company Code:</span>
                  <span className="text-900">{company.companyCode}</span>
                </div>
              )}
              
              {company.npwp && (
                <div className="flex justify-content-between">
                  <span className="text-600 font-medium">NPWP:</span>
                  <span className="text-900 font-mono">{company.npwp}</span>
                </div>
              )}
              
              {company.companyCity && (
                <div className="flex justify-content-between">
                  <span className="text-600 font-medium">City:</span>
                  <span className="text-900">{company.companyCity}</span>
                </div>
              )}
            </div>
          </Fieldset>
        </div>

        {/* Contact Information */}
        <div className="col-12 md:col-6">
          <Fieldset legend="Contact Information" className="mb-4">
            <div className="space-y-3">
              {company.companyEmail && (
                <div className="flex justify-content-between">
                  <span className="text-600 font-medium">Email:</span>
                  <a href={`mailto:${company.companyEmail}`} className="text-blue-600 hover:text-blue-800">
                    {company.companyEmail}
                  </a>
                </div>
              )}
              
              {company.companyTelpFax && (
                <div className="flex justify-content-between">
                  <span className="text-600 font-medium">Phone/Fax:</span>
                  <span className="text-900">{company.companyTelpFax}</span>
                </div>
              )}
            </div>
          </Fieldset>
        </div>

        {/* Address */}
        {company.companyAddress && (
          <div className="col-12">
            <Fieldset legend="Address" className="mb-4">
              <p className="text-900 m-0">{company.companyAddress}</p>
            </Fieldset>
          </div>
        )}

        {/* Segments */}
        {company.segments && company.segments.length > 0 && (
          <div className="col-12">
            <Fieldset legend="Business Segments" className="mb-4">
              <div className="flex flex-wrap gap-2">
                {company.segments.map((segment, index) => (
                  <Tag 
                    key={index}
                    value={typeof segment === 'object' ? segment.segmentName : segment}
                    severity="info"
                    rounded
                  />
                ))}
              </div>
            </Fieldset>
          </div>
        )}

        {/* Additional Information */}
        <div className="col-12">
          <Divider />
          <div className="grid text-sm">
            <div className="col-6 md:col-3">
              <span className="text-600">Created:</span>
              <div className="text-900 font-medium">
                {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div className="col-6 md:col-3">
              <span className="text-600">Last Updated:</span>
              <div className="text-900 font-medium">
                {company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}