import React, { useEffect, useState, useRef } from 'react';
import { getMasterItems, createMasterItem, updateMasterItem, deleteMasterItem } from '../../api/distro-po/masteritem';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// Custom renderer for price column to add comma delimiter
function priceCommaRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (typeof value === 'number' && !isNaN(value)) {
    td.textContent = value.toLocaleString('en-US');
  } else if (typeof value === 'string' && value !== '' && !isNaN(Number(value))) {
    td.textContent = Number(value).toLocaleString('en-US');
  }
}

const columns = [
  { data: 'vehicle', type: 'text', title: 'Vehicle' },
  { data: 'vehicleId', type: 'text', title: 'Vehicle ID' },
  { data: 'category', type: 'text', title: 'Category' },
  { data: 'productName', type: 'text', title: 'Product Name' },
  { data: 'spType', type: 'text', title: 'SP Type' },
  { data: 'itemId', type: 'text', title: 'Item ID' },
  { data: 'isActive', type: 'checkbox', title: 'Active' },
  { data: 'price', type: 'numeric', title: 'Price', renderer: priceCommaRenderer, className: 'htRight' },
];

export default function MasterItemPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const hotTableComponent = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const items = await getMasterItems();
      if (Array.isArray(items)) {
        setData(items);
      } else {
        setData([]);
      }
      setError('');
    } catch {
      setError('Failed to fetch items');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAfterChange = async (changes, source) => {
    if (source === 'edit' && changes) {
      setUnsaved(true);
    }
  };

  const handleAddRow = async () => {
    const hot = hotTableComponent.current.hotInstance;
    const newRow = {};
    columns.forEach(col => {
      if (col.type === 'checkbox') {
        newRow[col.data] = false;
      } else if (col.type === 'numeric') {
        newRow[col.data] = 0;
      } else {
        newRow[col.data] = '';
      }
    });
    try {
      await createMasterItem(newRow);
      showNotification('Row added successfully', 'success');
      await fetchItems();
      setTimeout(() => {
        hot.scrollViewportTo(data.length, 0);
      }, 300);
    } catch {
      showNotification('Failed to add row', 'error');
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    const row = data[rowIndex];
    if (!row || !row.id) return;
    try {
      await deleteMasterItem(row.id);
      showNotification('Row deleted successfully', 'success');
      await fetchItems();
    } catch {
      showNotification('Failed to delete row', 'error');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let success = true;
    for (const row of data) {
      if (row && typeof row === 'object') {
        const {
          vehicle,
          vehicleId,
          category,
          productName,
          spType,
          itemId,
          isActive,
          price
        } = row;
        try {
          if (row.id) {
            await updateMasterItem(row.id, {
              vehicle,
              vehicleId,
              category,
              productName,
              spType,
              itemId,
              isActive,
              price
            });
          } else {
            await createMasterItem({
              vehicle,
              vehicleId,
              category,
              productName,
              spType,
              itemId,
              isActive,
              price
            });
          }
        } catch {
          success = false;
        }
      }
    }
    if (success) {
      showNotification('All changes saved successfully', 'success');
      await fetchItems();
      setUnsaved(false);
    } else {
      showNotification('Some changes failed to save', 'error');
    }
    setSaving(false);
  };

  const handleExportData = () => {
    const hot = hotTableComponent.current.hotInstance;
    const exportPlugin = hot.getPlugin('exportFile');
    exportPlugin.exportToFile('csv', {
      filename: 'master-items',
      mimeType: 'text/csv',
      fileExtension: 'csv'
    });
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Master Item</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your product catalog and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleExportData}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleAddRow}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Row
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                </svg>
                Save All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert for unsaved changes */}
      {unsaved && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-amber-800">You have unsaved changes. Don't forget to save your work!</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Handsontable */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <style>{`
          .handsontable {
            font-family: inherit;
            font-size: 0.875rem;
          }
          .handsontable thead th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
            border-bottom: 1px solid #e2e8f0;
          }
          .handsontable tbody tr:hover td {
            background-color: #f8fafc;
          }
          .handsontable td {
            border-color: #f1f5f9;
          }
          .handsontable .htDimmed {
            color: #64748b;
          }
          .handsontable input[type=checkbox] {
            margin: 0;
          }
        `}</style>
        <div style={{ width: '100%', minHeight: 500 }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading master items...</span>
            </div>
          ) : (
            <HotTable
              ref={hotTableComponent}
              data={data}
              colHeaders={columns.map(col => col.title)}
              columns={columns}
              rowHeaders={true}
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={handleAfterChange}
              manualColumnResize={true}
              manualRowResize={true}
              filters={true}
              dropdownMenu={true}
              contextMenu={['row_above', 'row_below', 'remove_row', 'undo', 'redo', 'make_read_only', 'alignment']}
              height={500}
              minRows={10}
              minSpareRows={1}
              className="htContainer htHandsontable"
            />
          )}
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 ${
          notification.type === 'success' ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}