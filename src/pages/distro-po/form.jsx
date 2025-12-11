// Custom renderer for greyed-out (readOnly) columns
function greyedReadOnlyRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.background = '#F9FAFB'; // Tailwind gray-50 (lighter)
  td.style.color = '#505660ff'; // Tailwind gray-700 (dark for readability)
}
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDistributorPOById } from '../../api/distro-po/distro-po';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
// Custom renderer to highlight cell yellow if value is null (for partName and qty)
function yellowMarkingRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (value === null || value === undefined || value === '') {
    td.style.background = '#FEF08A'; // Tailwind yellow-200
    td.style.border = '1px solid #FACC15'; // Tailwind yellow-400
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
import 'handsontable/dist/handsontable.full.min.css';
import { Save, Printer, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { saveDistributorPO } from '../../api/distro-po/distro-po';
import { updateDistributorPO } from '../../api/distro-po/distro-po';
import { getMasterItems } from '../../api/distro-po/masteritem';

const DistributorPOForm = () => {
          const navigate = useNavigate();
          const { id: uuid } = useParams();
        const [poNotFound, setPoNotFound] = useState(false);
  // Load master items for dropdown (must be top-level, not nested)
  useEffect(() => {
    getMasterItems().then(items => {
      setMasterItems(Array.isArray(items) ? items : []);
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
                category: item.vehicleCategory,
                type: item.spType,
                partName: item.partName,
                partNumber: item.partNumber,
                qty: item.qty
              }))
            : [
                { id: 1, category: null, type: null, partName: null, partNumber: null, qty: null },
                { id: 2, category: null, type: null, partName: null, partNumber: null, qty: null },
                { id: 3, category: null, type: null, partName: null, partNumber: null, qty: null },
                { id: 4, category: null, type: null, partName: null, partNumber: null, qty: null },
                { id: 5, category: null, type: null, partName: null, partNumber: null, qty: null },
                { id: 6, category: null, type: null, partName: null, partNumber: null, qty: null },
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
    const [masterItems, setMasterItems] = useState([]);
  // 1. State for the Header Information
  const [headerInfo, setHeaderInfo] = useState({
    distributorName: 'PT ABC',
    custCode: 'C99999',
    poDate: '2023-12-25',
    poNumber: '9999.PO.25.999999',
    niterraSO: ''
  });

  // State for Niterra PO number returned from backend
  const [niterraPO, setNiterraPO] = useState('');

  // 2. State for the Line Items (Data from CSV)
  const [items, setItems] = useState([
    { id: 1, category: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 2, category: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 3, category: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 4, category: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 5, category: null, type: null, partName: null, partNumber: null, qty: null },
    { id: 6, category: null, type: null, partName: null, partNumber: null, qty: null },
  ]);

  // 3. State for Summary Calculations
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

  // Handler for all table changes (edit, paste, row add/remove, etc)
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
          // Auto-fill partNumber, S/P Type, and Vehicle ID from masterItems
          const selected = masterItems.find(item => item.productName === newValue);
          if (selected) {
            newItems[rowIdx].partNumber = selected.itemId || '';
            newItems[rowIdx].type = selected.spType || '';
            // Set category to vehicleId from master item
            newItems[rowIdx].category = selected.vehicleId || '';
          } else {
            newItems[rowIdx].partNumber = '';
            newItems[rowIdx].type = '';
            newItems[rowIdx].category = '';
          }
        }
      });
      setItems(newItems);
      setSummary(calculateSummary(newItems));
    } else if (source === 'LoadData' || source === 'spliceRow' || source === 'insertRow' || source === 'removeRow') {
      // For row add/remove or data load
      setSummary(calculateSummary(items));
    }
  };

  // Handler for Header Inputs
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderInfo(prev => ({ ...prev, [name]: value }));
    setUnsaved(true);
  };

  // Handler for Item Qty Change
  const handleItemChange = (id, val) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, qty: val } : item
    );
    setItems(newItems);
    setUnsaved(true);
  };

  // Validation: check if any partName or qty is null/empty
  const hasIncompleteRows = items.some(item => !item.partName || item.partName === '' || item.qty === null || item.qty === undefined || item.qty === '' || isNaN(item.qty));

  // Handler for Save Button
  const handleSavePO = async () => {
    if (hasIncompleteRows) {
      setSaveStatus({ loading: false, message: 'Please fill all Part Name and Qty fields before saving.', error: true });
      return;
    }
    setSaveStatus({ loading: true, message: '', error: false });
    const { salesPONumber, ...headerInfoClean } = headerInfo;
    let result;
    if (niterraPO && uuid) {
      // Update existing PO
      result = await updateDistributorPO(uuid, headerInfoClean, items);
    } else {
      // Create new PO
      result = await saveDistributorPO(headerInfoClean, items);
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
          body * {
            visibility: hidden !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
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
      `}</style>
      
      {poNotFound ? (
        <div className="max-w-xl mx-auto mt-20 p-8 bg-white shadow-lg text-center border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">PO Not Found</h2>
          <p className="text-gray-700 mb-4">The requested Distributor PO does not exist or has been deleted.</p>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow"
            onClick={() => navigate('/distro-po/dashboard/list')}
          >
            &larr; Back to PO List
          </button>
        </div>
      ) : (
        <div id="print-area" className="max-w-6xl mx-auto p-8 bg-white shadow-lg my-8 print:shadow-none print:p-0">
        {/* Title Section + Niterra PO Number */}
        <div className="flex flex-col gap-2 mb-6 border-b-2 pb-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow mb-2 md:mb-0"
            onClick={() => navigate('/distro-po/dashboard/list')}
          >
            &larr; Back to PO List
          </button>
          {unsaved && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 font-semibold rounded md:ml-4 flex items-center">
              <span className="mr-2">⚠️</span>There are unsaved changes. Please save your work.
            </div>
          )}
        </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              DISTRIBUTOR PO FORM - JANUARY
            </h1>
            <div className="flex gap-2 print:hidden">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSavePO}
                disabled={saveStatus.loading}
              >
                <Save size={16} />
                {saveStatus.loading ? 'Saving...' : 'Save PO'}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
          {/* Niterra PO Number Info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Niterra PO Number:</span>
            <span className="px-2 py-1 rounded border border-gray-300 bg-white font-mono text-gray-800">
              {niterraPO
                ? niterraPO
                : <span className="text-gray-400">Auto-generated after save</span>}
            </span>
          </div>
          {/* Save status message */}
          {saveStatus.message && (
            <div className={`mt-2 text-sm ${saveStatus.error ? 'text-red-600' : 'text-green-600'}`}>{saveStatus.message}</div>
          )}
        </div>

        {/* Top Grid: Header Info & Summary Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Left Col: Header Inputs */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">                        
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nama Distro</label>
                <input 
                  type="text" 
                  name="distributorName"
                  value={headerInfo.distributorName}
                  onChange={handleHeaderChange}
                  className="w-full border p-2 rounded bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Cust Code</label>
                <input 
                  type="text" 
                  name="custCode"
                  value={headerInfo.custCode}
                  onChange={handleHeaderChange}
                  className="w-full border p-2 rounded bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Tanggal PO</label>
                <input 
                  type="date" 
                  name="poDate"
                  value={headerInfo.poDate}
                  onChange={handleHeaderChange}
                  className="w-full border p-2 rounded bg-yellow-50 border-yellow-300" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Nomor PO Distro</label>
                <input
                  type="text"
                  name="poNumber"
                  value={headerInfo.poNumber}
                  onChange={handleHeaderChange}
                  className="w-full border p-2 rounded bg-yellow-50 border-yellow-300 font-mono text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Niterra SO Number</label>
                <input 
                  type="text" 
                  name="niterraSO"
                  placeholder="Niterra SO Number"
                  value={headerInfo.niterraSO}
                  onChange={handleHeaderChange}
                  className="w-full border p-2 rounded bg-yellow-50 border-yellow-300"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 border border-blue-200">
              <strong>Catatan:</strong> Distributor hanya menginput data yang diberi tanda/marking warna <span className="bg-yellow-200 px-1 border border-yellow-400 text-black">KUNING</span>.
            </div>
          </div>

          {/* Right Col: Summary Dashboard */}
          <div className="bg-gray-100 p-4 rounded border border-gray-300">
            <h3 className="font-bold text-center border-b border-gray-400 pb-2 mb-2">SUMMARY PO</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-1">2W Ni</td>
                  <td className="text-right font-mono">{Number(summary.twoWNi).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1">2W PM</td>
                  <td className="text-right font-mono">{Number(summary.twoWPM).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1">4W Ni</td>
                  <td className="text-right font-mono">{Number(summary.fourWNi).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1">4W PM</td>
                  <td className="text-right font-mono">{Number(summary.fourWPM).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-1">Plug Cap</td>
                  <td className="text-right font-mono">{Number(summary.plugCap).toLocaleString()}</td>
                </tr>
                <tr className="font-bold bg-gray-200">
                  <td className="py-2 pl-2">TOTAL</td>
                  <td className="text-right pr-2">{Number(summary.total).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-bold text-center border-b border-gray-400 pb-2 mt-4 mb-2">Special P/N</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1">GP Type</td>
                  <td className="text-right font-mono">{Number(summary.gpTotal).toLocaleString()}</td>
                </tr>
                {/* Add other special parts here if needed from CSV */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <HotTable
            data={items}
            colHeaders={["Vehicle Category", "S/P Type", "Part Name", "Part Number", "Nomor PO Distro", "Qty"]}
            columns={[
              { data: 'category', type: 'text', readOnly: true, renderer: greyedReadOnlyRenderer },
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
            ]}
            rowHeaders={true}
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            afterChange={handleTableChange}
            height={300}
            minRows={1}
            minSpareRows={0}
            filters={true}
            dropdownMenu={true}
            columnSorting={true}
            contextMenu={true}
          />
        </div>

        {/* Footer / Signature Area removed as per new requirements */}

        </div>
      )}
    </>
  );
};

export default DistributorPOForm;