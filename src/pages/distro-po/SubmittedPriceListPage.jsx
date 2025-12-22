import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

export default function SubmittedPriceListPage() {
  const navigate = useNavigate();
  // Get current user from sessionStorage (assume userInfo is stored as JSON)
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || '{}');
  // Header state: only description is input, createdBy is from userInfo
  const [header, setHeader] = useState({ description: "" });
  // Lines state
  const [lines, setLines] = useState([
    { customerCode: "", customerName: "", itemId: "", itemName: "", price: 0, activationDate: "" }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hotRef = useRef(null);

  // Columns for Handsontable
  const columns = [
    { data: "customerCode", type: "text", title: "Customer Code" },
    { data: "customerName", type: "text", title: "Customer Name" },
    { data: "itemId", type: "text", title: "Item ID" },
    { data: "itemName", type: "text", title: "Item Name" },
    { data: "price", type: "numeric", title: "Price" },
    { data: "activationDate", type: "date", dateFormat: "YYYY-MM-DD", correctFormat: true, title: "Activation Date" },
  ];

  // Handle header input
  const handleHeaderChange = (e) => {
    setHeader({ ...header, description: e.target.value });
  };

  // Save handler (stub, replace with API call)
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // TODO: Replace with actual API call to save header and lines
      // Example: await api.saveMasterItemPriceHeaderAndLines({ ...header, createdBy: userInfo?.username || "" }, lines);
      alert("Saved! (stub)");
    } catch (err) {
      setError("Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Master Item Price Maintenance</h1>
      <div className="flex gap-4 mb-6">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => navigate('/distro-po/dashboard/masteritem-price')}
        >
          View Submitted Price List
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow mb-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-2">Header</h2>
        <div className="mb-2">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={header.description}
            onChange={handleHeaderChange}
            className="w-full border rounded px-3 py-2 min-h-[80px]"
            required
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Price Lines</h2>
        <HotTable
          ref={hotRef}
          data={lines}
          colHeaders={columns.map(col => col.title)}
          columns={columns}
          rowHeaders={true}
          width="100%"
          stretchH="all"
          minRows={5}
          licenseKey="non-commercial-and-evaluation"
          afterChange={(_, source) => {
            if (source === 'edit' || source === 'Paste') {
              setLines(hotRef.current.hotInstance.getData().map((row, idx) => {
                const obj = {};
                columns.forEach((col, i) => { obj[col.data] = row[i]; });
                return obj;
              }));
            }
          }}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
