import React, { useState, useEffect } from 'react';
import { Save, Printer, FileText } from 'lucide-react';

import { saveDistributorPO } from '../../api/distro-po/distro-po';

const DistributorPOForm = () => {
  // 1. State for the Header Information
  const [headerInfo, setHeaderInfo] = useState({
    distributorName: 'PT ABC',
    custCode: 'C99999',
    poDate: '2023-12-25',
    poNumber: '9999.PO.25.999999',
    createdBy: '',
    approvedBy: ''
  });

  // 2. State for the Line Items (Data from CSV)
  const [items, setItems] = useState([
    { id: 1, category: '4W Ni', type: 'YL', partName: 'Part 1', partNumber: 'Part Number 1', qty: 50 },
    { id: 2, category: '4W Ni', type: 'YL', partName: 'Part 2', partNumber: 'Part Number 2', qty: 170 },
    { id: 3, category: '4W Ni', type: 'YL', partName: 'Part 3', partNumber: 'Part Number 3', qty: 20 },
    { id: 4, category: '4W PM', type: 'GP', partName: 'Part 4', partNumber: 'Part Number 4', qty: 40 },
    { id: 5, category: '4W Ni', type: 'YL', partName: 'Part 5', partNumber: 'Part Number 5', qty: 20 },
    { id: 6, category: '4W PM', type: 'GP', partName: 'Part 6', partNumber: 'Part Number 6', qty: 30 },
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

  // State for save status
  const [saveStatus, setSaveStatus] = useState({ loading: false, message: '', error: false });

  // Calculate totals whenever items change
  useEffect(() => {
    let s = { twoWNi: 0, twoWPM: 0, fourWNi: 0, fourWPM: 0, plugCap: 0, total: 0, gpTotal: 0 };

    items.forEach(item => {
      const qty = parseInt(item.qty) || 0;
      
      // Categorize based on Vehicle Category
      if (item.category === '2W Ni') s.twoWNi += qty;
      if (item.category === '2W PM') s.twoWPM += qty;
      if (item.category === '4W Ni') s.fourWNi += qty;
      if (item.category === '4W PM') s.fourWPM += qty;
      if (item.category === 'Plug Cap') s.plugCap += qty;
      
      // Special Types
      if (item.type === 'GP') s.gpTotal += qty;

      s.total += qty;
    });

    setSummary(s);
  }, [items]);

  // Handler for Header Inputs
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handler for Item Qty Change
  const handleItemChange = (id, val) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, qty: val } : item
    );
    setItems(newItems);
  };

  // Handler for Save Button
  const handleSavePO = async () => {
    setSaveStatus({ loading: true, message: '', error: false });
    const result = await saveDistributorPO(headerInfo, items);
    if (result.success) {
      setSaveStatus({ loading: false, message: result.message || 'PO saved successfully!', error: false });
    } else {
      setSaveStatus({ loading: false, message: result.message || 'Failed to save PO', error: true });
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
      <div id="print-area" className="max-w-6xl mx-auto p-8 bg-white shadow-lg my-8 print:shadow-none print:p-0">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
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
                className="w-full border p-2 rounded bg-yellow-50 border-yellow-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Created By</label>
              <input 
                type="text" 
                name="createdBy"
                placeholder="Name"
                value={headerInfo.createdBy}
                onChange={handleHeaderChange}
                className="w-full border p-2 rounded bg-yellow-50 border-yellow-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Approved By</label>
              <input 
                type="text" 
                name="approvedBy"
                placeholder="Manager Name"
                value={headerInfo.approvedBy}
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
                <td className="text-right font-mono">{summary.twoWNi}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">2W PM</td>
                <td className="text-right font-mono">{summary.twoWPM}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">4W Ni</td>
                <td className="text-right font-mono">{summary.fourWNi}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">4W PM</td>
                <td className="text-right font-mono">{summary.fourWPM}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Plug Cap</td>
                <td className="text-right font-mono">{summary.plugCap}</td>
              </tr>
              <tr className="font-bold bg-gray-200">
                <td className="py-2 pl-2">TOTAL</td>
                <td className="text-right pr-2">{summary.total}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold text-center border-b border-gray-400 pb-2 mt-4 mb-2">Special P/N</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1">GP Type</td>
                <td className="text-right font-mono">{summary.gpTotal}</td>
              </tr>
              {/* Add other special parts here if needed from CSV */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-2 w-12">NO</th>
              <th className="border border-gray-300 p-2">Vehicle Category</th>
              <th className="border border-gray-300 p-2">S/P Type</th>
              <th className="border border-gray-300 p-2 text-left">Part Name</th>
              <th className="border border-gray-300 p-2 text-left">Part Number</th>
              <th className="border border-gray-300 p-2">Nomor PO Distro</th>
              <th className="border border-gray-300 p-2 w-32 bg-yellow-200">Qty (Input)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 text-center">{item.id}</td>
                <td className="border border-gray-300 p-2 text-center">{item.category}</td>
                <td className="border border-gray-300 p-2 text-center">{item.type}</td>
                <td className="border border-gray-300 p-2">{item.partName}</td>
                <td className="border border-gray-300 p-2 font-mono">{item.partNumber}</td>
                <td className="border border-gray-300 p-2 text-center text-gray-500">
                  {headerInfo.poNumber}
                </td>
                <td className="border border-gray-300 p-0">
                  <input 
                    type="number" 
                    min="0"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, e.target.value)}
                    className="w-full h-full p-2 text-center bg-yellow-50 focus:bg-yellow-100 outline-none font-bold"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Signature Area */}
      <div className="mt-8 grid grid-cols-3 gap-8 text-center print:mt-16">
        <div>
          <p className="mb-16">Created By,</p>
          <div className="border-b border-black mx-8"></div>
          <p className="mt-2 text-sm text-gray-600">{headerInfo.createdBy || "(Signature)"}</p>
        </div>
        <div></div>
        <div>
          <p className="mb-16">Approved By,</p>
          <div className="border-b border-black mx-8"></div>
          <p className="mt-2 text-sm text-gray-600">{headerInfo.approvedBy || "(Signature)"}</p>
        </div>
      </div>

      </div>
    </>
  );
};

export default DistributorPOForm;