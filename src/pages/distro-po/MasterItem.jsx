import React, { useEffect, useState, useRef } from "react";
import {
  getMasterItems,
  createMasterItem,
  updateMasterItem,
  deleteMasterItem,
} from "../../api/distro-po/masteritem";
import { HotTable } from "@handsontable/react-wrapper";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import EmptyState from "../../components/ui/Loading-Table";

/**
 * Custom renderer untuk format angka dengan koma (currency style)
 */
function priceCommaRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (typeof value === "number" && !isNaN(value)) {
    td.textContent = value.toLocaleString("en-US");
  } else if (typeof value === "string" && value !== "" && !isNaN(Number(value))) {
    td.textContent = Number(value).toLocaleString("en-US");
  }
}

const columns = [
  { data: "vehicle", type: "text", title: "Vehicle" },
  { data: "vehicleId", type: "text", title: "Vehicle ID" },
  { data: "category", type: "text", title: "Category" },
  { data: "productName", type: "text", title: "Product Name" },
  { data: "spType", type: "text", title: "SP Type" },
  { data: "itemId", type: "text", title: "Item ID" },
  { data: "isActive", type: "checkbox", title: "Active" },
  {
    data: "price",
    type: "numeric",
    title: "Price",
    renderer: priceCommaRenderer,
    className: "htRight",
  },
];

export default function MasterItemPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
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
      setData(Array.isArray(items) ? items : []);
      setError("");
    } catch {
      setError("Failed to fetch items");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 3000);
  };

  const handleAfterChange = (changes, source) => {
    if (source === "edit" && changes) {
      setUnsaved(true);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let success = true;

    // Filter baris yang valid (tidak kosong)
    const filteredRows = data.filter((row) => {
      if (!row || typeof row !== "object") return false;
      const keysToCheck = ["vehicle", "vehicleId", "category", "productName", "spType", "itemId", "price"];
      return keysToCheck.some((key) => row[key] && String(row[key]).trim() !== "");
    });

    try {
      const currentItems = await getMasterItems();
      const currentIds = Array.isArray(currentItems) ? currentItems.map((i) => i.id) : [];
      const updatedIds = filteredRows.filter((r) => r.id).map((r) => r.id);
      const idsToDelete = currentIds.filter((id) => !updatedIds.includes(id));

      // Proses Upsert
      for (const row of filteredRows) {
        if (row.id) {
          await updateMasterItem(row.id, row);
        } else {
          await createMasterItem(row);
        }
      }

      // Proses Delete
      for (const id of idsToDelete) {
        await deleteMasterItem(id);
      }

      showNotification("All changes saved successfully", "success");
      await fetchItems();
      setUnsaved(false);
    } catch {
      showNotification("Some changes failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const hot = hotTableComponent.current.hotInstance;
    const exportPlugin = hot.getPlugin("ExportFile");
    if (exportPlugin) {
      exportPlugin.downloadFile("csv", {
        filename: "master-items",
        columnHeaders: true,
        rowHeaders: false,
      });
    }
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
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            onClick={handleExportData}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all flex items-center gap-2"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {unsaved && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6 italic shadow-sm">
          ⚠️ You have unsaved changes. Don't forget to save your work!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 shadow-sm">
          ❌ {error}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-24 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-500 font-medium">Loading catalog data...</span>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="No Master Items Found"
          description="Your product catalog is currently empty. Start by adding items to the table."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <style>{`
            .htContainer { position: relative; z-index: 1 !important; }
            .handsontable thead th { 
              background-color: #f8fafc; 
              color: #475569; 
              font-weight: 600; 
              z-index: 2 !important; 
            }
            .handsontable td { border-color: #f1f5f9; }
          `}</style>
          <div style={{ width: "100%", height: 550 }}>
            <HotTable
              ref={hotTableComponent}
              data={data}
              colHeaders={columns.map((col) => col.title)}
              columns={columns}
              rowHeaders={true}
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              afterChange={handleAfterChange}
              manualColumnResize={true}
              manualRowResize={true}
              filters={true}
              dropdownMenu={true}
              contextMenu={["row_above", "row_below", "remove_row", "undo", "redo", "alignment"]}
              height="100%"
              minRows={5}
              minSpareRows={1}
              className="htContainer htHandsontable"
            />
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-2xl border-l-4 bg-white min-w-[300px] flex items-center gap-3 ${
          notification.type === "success" ? "border-green-500" : "border-red-500"
        }`}>
          <div className={`p-1 rounded-full ${notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {notification.type === "success" ? "✓" : "✕"}
          </div>
          <p className="font-semibold text-gray-800">{notification.message}</p>
        </div>
      )}
    </div>
  );
}