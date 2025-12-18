
import React, { useState, useEffect } from 'react';
import { fetchNgkaxSONumbers } from '../../api/NGKAX/NGKAX';
import { useParams, useNavigate } from 'react-router-dom';
import { getDistributorPOById } from '../../api/distro-po/distro-po';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import { Save, Printer, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import { saveDistributorPO } from '../../api/distro-po/distro-po';
import { updateDistributorPO } from '../../api/distro-po/distro-po';
import { getMasterItems } from '../../api/distro-po/masteritem';
import 'handsontable/dist/handsontable.full.min.css';

// Custom renderer for greyed-out (readOnly) columns
function greyedReadOnlyRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.background = '#F8FAFC';
  td.style.color = '#64748B';
  td.style.fontWeight = '500';
  cellProperties.readOnly = true;
  // Align right and add comma delimiter for price column
  if (prop === 'price') {
    td.style.textAlign = 'right';
    if (value !== null && value !== undefined && value !== '') {
      td.textContent = Number(value).toLocaleString();
    }
  }
}

// Custom renderer to highlight cell yellow if value is null (for partName and qty)
function yellowMarkingRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (value === null || value === undefined || value === '') {
    td.style.background = '#FEF3C7';
    td.style.border = '1px solid #F59E0B';
  } else {
    td.style.background = '';
    td.style.border = '';
  }
  // Align right and add comma delimiter for qty column
  if (prop === 'qty') {
    td.style.textAlign = 'right';
    if (value !== null && value !== undefined && value !== '') {
      td.textContent = Number(value).toLocaleString();
    }
  }
}

const DistributorPOForm = () => {
  const navigate = useNavigate();
  const { id: uuid } = useParams();
  const [poNotFound, setPoNotFound] = useState(false);
  const [masterItems, setMasterItems] = useState([]);

  // State for the Header Information
  const [headerInfo, setHeaderInfo] = useState({
    distributorName: 'PT ABC',
    custCode: 'C99999',
    poDate: '2023-12-25',
    poNumber: '9999.PO.25.999999',
    niterraSO: '',
    ngkaxSO: ''
  });

  // State for Niterra PO number returned from backend
  const [niterraPO, setNiterraPO] = useState('');

  // State for the Line Items
  const [items, setItems] = useState([
    { id: 1, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 2, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 3, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 4, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 5, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 6, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
  ]);

  // State for Summary Calculations
  const [summary, setSummary] = useState({
    twoWNi: 0,
    twoWPM: 0,
    fourWNi: 0,
    fourWPM: 0,
    plugCap: 0,
    total: 0,
    gpTotal: 0
  });

  // State for unsaved changes
  const [unsaved, setUnsaved] = useState(false);
  // State for save status
  const [saveStatus, setSaveStatus] = useState({ loading: false, message: '', error: false });

  // Load master items for dropdown
  useEffect(() => {
    getMasterItems().then(items => {
      const activeItems = Array.isArray(items) ? items.filter(item => item.isActive === true || item.isActive === 'Y') : [];
      setMasterItems(activeItems);
    });
  }, []);

  // Load PO data if editing/viewing by ID
  useEffect(() => {
    if (typeof uuid === 'string' && uuid.trim() !== '') {
      getDistributorPOById(uuid).then(result => {
        if (result.success && result.data) {
          const po = result.data;
          setHeaderInfo({
            distributorName: po.distributorName,
            custCode: po.customerCode,
            poDate: po.poDate?.slice(0, 10) || '',
            poNumber: po.poNumber,
            niterraSO: po.niterraSO || ''
          });
          setNiterraPO(po.niterraPO || '');
          const loadedItems = Array.isArray(po.items) && po.items.length > 0
            ? po.items.map((item, idx) => ({
              id: idx + 1,
              vehicle: item.vehicle || '',
              category: item.category || '',
              vehicleId: item.vehicleId || '',
              price: item.price ?? null,
              type: item.spType,
              partName: item.partName,
              partNumber: item.partNumber,
              qty: item.qty
            }))
            : [
              { id: 1, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
              { id: 2, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
              { id: 3, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
              { id: 4, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
              { id: 5, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
              { id: 6, vehicle: null, category: null, price: null, type: null, partName: null, partNumber: null, qty: null },
            ];
          setItems(loadedItems);
          setSummary(calculateSummary(loadedItems));
          setPoNotFound(false);
        } else {
          setPoNotFound(true);
        }
      });
    } else {
      setPoNotFound(false);
    }
  }, [uuid]);

  // Calculate summary from items array
  const calculateSummary = (data) => {
    let s = { twoWNi: 0, twoWPM: 0, fourWNi: 0, fourWPM: 0, plugCap: 0, total: 0, gpTotal: 0 };
    data.forEach(item => {
      const qty = parseInt(item.qty) || 0;
      if (item.category === '2W Ni') s.twoWNi += qty;
      if (item.category === '2W PM') s.twoWPM += qty;
      if (item.category === '4W Ni') s.fourWNi += qty;
      if (item.category === '4W PM') s.fourWPM += qty;
      if (item.category === 'Plug Cap') s.plugCap += qty;
      if (item.type === 'GP') s.gpTotal += qty;
      s.total += qty;
    });
    return s;
  };

  // Handler for all table changes
  const handleTableChange = (changes, source) => {
    if (changes) setUnsaved(true);
    if (changes) {
      const newItems = [...items];
      changes.forEach(([rowIdx, prop, oldValue, newValue]) => {
        if (prop === 'qty' && prop in newItems[rowIdx]) {
          newItems[rowIdx][prop] = newValue;
        }
        if (prop === 'partName' && prop in newItems[rowIdx]) {
          newItems[rowIdx][prop] = newValue;
          const selected = masterItems.find(item => item.productName === newValue);
          if (selected) {
            newItems[rowIdx].partNumber = selected.itemId || '';
            newItems[rowIdx].type = selected.spType || '';
            newItems[rowIdx].category = selected.category || '';
            newItems[rowIdx].vehicleId = selected.vehicleId || '';
            newItems[rowIdx].vehicle = selected.vehicle || '';
            newItems[rowIdx].price = selected.price ?? null;
          } else {
            newItems[rowIdx].partNumber = '';
            newItems[rowIdx].type = '';
            newItems[rowIdx].category = '';
            newItems[rowIdx].vehicle = '';
            newItems[rowIdx].price = null;
          }
        }
        if (prop === 'vehicle' && prop in newItems[rowIdx]) {
          newItems[rowIdx][prop] = newValue;
        }
        if (prop === 'category' && prop in newItems[rowIdx]) {
          newItems[rowIdx][prop] = newValue;
        }
        if (prop === 'price' && prop in newItems[rowIdx]) {
          newItems[rowIdx][prop] = newValue;
        }
      });
      setItems(newItems);
      setSummary(calculateSummary(newItems));
    } else if (source === 'LoadData' || source === 'spliceRow' || source === 'insertRow' || source === 'removeRow') {
      setSummary(calculateSummary(items));
    }
  };

  // Handler for Header Inputs
  const handleHeaderChange = async (e) => {
    const { name, value } = e.target;
    setHeaderInfo(prev => ({ ...prev, [name]: value }));
    setUnsaved(true);

    if (name === 'poNumber' && value) {
      const ngkaxSOValue = await fetchNgkaxSONumbers(value);
      setHeaderInfo(prev => ({
        ...prev,
        ngkaxSO: ngkaxSOValue
      }));
      console.log('Fetched NGKAX SO Numbers:', ngkaxSOValue);
    }
  };

  // Validation
  const hasIncompleteRows = items.some(item => {
    const partNameFilled = item.partName !== null && item.partName !== undefined && item.partName !== '';
    const qtyFilled = item.qty !== null && item.qty !== undefined && item.qty !== '' && !isNaN(item.qty);
    // If either partName or qty is filled, both must be filled
    if (partNameFilled || qtyFilled) {
      return !(partNameFilled && qtyFilled);
    }
    // If both are empty/null, it's allowed
    return false;
  });

  // Handler for Save Button
  const handleSavePO = async () => {
    if (hasIncompleteRows) {
      setSaveStatus({ loading: false, message: 'Please fill all Part Name and Qty fields before saving.', error: true });
      return;
    }
    setSaveStatus({ loading: true, message: '', error: false });
    const { salesPONumber, ...headerInfoClean } = headerInfo;
    // Filter out items where both partName and qty are null/empty
    const filteredItems = items.filter(item => {
      const partNameEmpty = item.partName === null || item.partName === undefined || item.partName === '';
      const qtyEmpty = item.qty === null || item.qty === undefined || item.qty === '';
      return !(partNameEmpty && qtyEmpty);
    });
    let result;
    if (niterraPO && uuid) {
      result = await updateDistributorPO(uuid, headerInfoClean, filteredItems);
    } else {
      result = await saveDistributorPO(headerInfoClean, filteredItems);
    }
    if (result.success) {
      if (result.data && result.data.niterraPO) {
        setNiterraPO(result.data.niterraPO);
      }
      setSaveStatus({ loading: false, message: result.message || (niterraPO ? 'PO updated successfully!' : 'PO saved successfully!'), error: false });
      setUnsaved(false);
    } else {
      setSaveStatus({ loading: false, message: result.message || (niterraPO ? 'Failed to update PO' : 'Failed to save PO'), error: true });
    }
  };

  return (
    <>
      {/* Print-only CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            background: white;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
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
      `}</style>

      {poNotFound ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PO Not Found</h2>
            <p className="text-gray-600 mb-6">The requested Distributor PO does not exist or has been deleted.</p>
            <button
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => navigate('/distro-po/dashboard/list')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to PO List
            </button>
          </div>
        </div>
      ) : (
        <div id="print-area" className="max-w-7xl mx-auto bg-white print:shadow-none print:border-none">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 print:hidden"
              onClick={() => navigate('/distro-po/dashboard/list')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to PO List
            </button>

            <div className="flex gap-3 print:hidden">
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSavePO}
                disabled={saveStatus.loading}
              >
                {saveStatus.loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save PO
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distributor PO Form</h1>
                <p className="text-sm text-gray-600">Purchase Order Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Niterra PO Number:</span>
              <span className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-50 font-mono text-sm text-gray-900">
                {niterraPO || (
                  <span className="text-gray-400">Auto-generated after save</span>
                )}
              </span>
            </div>
          </div>

          {/* Alerts */}
          <div className="p-6 pt-0 print:p-4 print:pt-0">
            {unsaved && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-amber-800 font-medium">You have unsaved changes. Please save your work.</p>
              </div>
            )}
            {saveStatus.message && (
              <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${saveStatus.error
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-green-50 border border-green-200 text-green-800'
                }`}>
                {saveStatus.error ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                ) : (
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <p className="font-medium">{saveStatus.message}</p>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:p-4">

            {/* Left: Header Inputs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distributor Name</label>
                    <input
                      type="text"
                      name="distributorName"
                      value={headerInfo.distributorName}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Code</label>
                    <input
                      type="text"
                      name="custCode"
                      value={headerInfo.custCode}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
                    <input
                      type="date"
                      name="poDate"
                      value={headerInfo.poDate}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50 border-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distributor PO Number</label>
                    <input
                      type="text"
                      name="poNumber"
                      value={headerInfo.poNumber}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50 border-amber-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niterra SO Number</label>
                    <input
                      type="text"
                      name="niterraSO"
                      placeholder="Niterra SO Number"
                      value={headerInfo.niterraSO}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50 border-amber-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NGKAX SO Number</label>
                    <input
                      type="text"
                      name="ngkaxSO"
                      placeholder="NGKAX SO Number"
                      value={typeof headerInfo.ngkaxSO === 'string' ? headerInfo.ngkaxSO : ''}
                      onChange={handleHeaderChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50 border-amber-300"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Distributors should only fill in the highlighted <span className="px-2 py-1 bg-amber-200 border border-amber-400 rounded text-black font-medium">yellow fields</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">PO Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">2W Nickel</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.twoWNi).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">2W PM</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.twoWPM).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">4W Nickel</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.fourWNi).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">4W PM</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.fourWPM).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Plug Cap</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.plugCap).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gray-200 px-4 rounded-lg -mx-4">
                    <span className="font-bold text-gray-900">TOTAL</span>
                    <span className="font-bold font-mono text-gray-900">{Number(summary.total).toLocaleString()}</span>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3 text-center pt-4 border-t border-gray-200">Special Parts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">GP Type</span>
                    <span className="font-mono font-semibold text-gray-900">{Number(summary.gpTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="pt-4 print:p-4 print:pt-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
              </div>
              <div className="p-6">
                <HotTable
                  data={items}
                  colHeaders={["Vehicle", "Category", "Vehicle Category", "S/P Type", "Part Name", "Part Number", "PO Number", "Quantity", "Price"]}
                  columns={[
                    { data: 'vehicle', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
                    { data: 'category', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
                    { data: 'vehicleId', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
                    { data: 'type', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
                    {
                      data: 'partName',
                      type: 'dropdown',
                      source: masterItems.map(item => item.productName),
                      readOnly: false,
                      renderer: yellowMarkingRenderer
                    },
                    { data: 'partNumber', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
                    { data: () => headerInfo.poNumber, readOnly: true, renderer: greyedReadOnlyRenderer },
                    {
                      data: 'qty',
                      type: 'numeric',
                      readOnly: false,
                      editor: 'numeric',
                      renderer: yellowMarkingRenderer,
                      className: 'htRight',
                      format: '0,0',
                    },
                    { data: 'price', type: 'numeric', readOnly: true, renderer: greyedReadOnlyRenderer, format: '0,0' },
                  ]}
                  hiddenColumns={{
                    // specify columns hidden by default
                    columns: [0, 1],
                  }}
                  rowHeaders={true}
                  stretchH="all"
                  licenseKey="non-commercial-and-evaluation"
                  afterChange={handleTableChange}
                  height={400}
                  minRows={15}
                  minSpareRows={1}
                  filters={true}
                  dropdownMenu={true}
                  columnSorting={true}
                  contextMenu={['row_above', 'row_below', 'remove_row', 'undo', 'redo']}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DistributorPOForm;
