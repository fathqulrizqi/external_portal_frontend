import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import { getAllDistributorPOs } from '../../utils/constants/po-list';
import { getAllDistributorPOs } from "../../api/distro-po/distro-po";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import EmptyState from "../../components/ui/Loading-Table";

function poNumberLinkRenderer(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.renderers.TextRenderer.apply(this, [
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties,
  ]);

  const rowData = instance.getSourceDataAtRow(row);
  const uuid = rowData.uuid;

  if (uuid) {
    td.innerHTML = `<a href="/distro-po/dashboard/form/${uuid}" class='text-blue-600 underline hover:text-blue-800'>${value}</a>`;
    td.style.cursor = "pointer";
    td.onclick = (e) => {
      e.preventDefault();
      window.location.href = `/distro-po/dashboard/form/${uuid}`;
    };
  } else {
    td.textContent = value;
  }
}

// Custom renderer for Date formatting
function dateRenderer(instance, td, row, col, prop, value, cellProperties) {
  // FIX: Teruskan parameter secara eksplisit, jangan gunakan 'arguments'
  Handsontable.renderers.TextRenderer.apply(this, [
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties,
  ]);

  if (!value) {
    td.textContent = "";
    return;
  }

  // Logika format tanggal yang sama seperti di DataTables Anda
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    td.textContent = value; // Tampilkan nilai asli jika tidak valid
  } else {
    td.textContent = date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  }
}

// Kolom untuk Handsontable
const columns = [
  {
    data: "poNumber",
    title: "PO Number",
    renderer: poNumberLinkRenderer,
  },
  { data: "distributorName", type: "text", title: "Distributor" },
  { data: "customerCode", type: "text", title: "Customer Code" },
  {
    data: "poDate",
    title: "Date",
    type: "date",
    dateFormat: "DD-MMM-YYYY",
    renderer: dateRenderer,
  },
  { data: "niterraSO", type: "text", title: "Niterra SO" },
  { data: "niterraPO", type: "text", title: "Niterra PO" },
  {
    data: "createdAt",
    type: "text",
    title: "Created At",
    renderer: (instance, td, row, col, prop, value, cellProperties) => {
      // Pastikan semua parameter ada
      // FIX: Teruskan parameter secara eksplisit, jangan gunakan 'arguments'
      Handsontable.renderers.TextRenderer.apply(this, [
        instance,
        td,
        row,
        col,
        prop,
        value,
        cellProperties,
      ]);
      td.textContent = value ? value.slice(0, 10) : "";
    },
    readOnly: true,
  },
  {
    data: "updatedAt",
    type: "text",
    title: "Updated At",
    renderer: (instance, td, row, col, prop, value, cellProperties) => {
      // Pastikan semua parameter ada
      // FIX: Teruskan parameter secara eksplisit, jangan gunakan 'arguments'
      Handsontable.renderers.TextRenderer.apply(this, [
        instance,
        td,
        row,
        col,
        prop,
        value,
        cellProperties,
      ]);
      td.textContent = value ? value.slice(0, 10) : "";
    },
    readOnly: true,
  },
];

const POList = () => {
  const navigate = useNavigate();
  const [poList, setPOList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hotTableComponent = useRef(null);

  useEffect(() => {
    async function fetchPOs() {
      setLoading(true);
      try {
        const result = await getAllDistributorPOs();
        if (result.success) {
          setPOList(result.data || []);
          setError("");
        } else {
          setError(result.message || "Failed to fetch PO list.");
        }
      } catch (e) {
        setError("Network Error or API structure mismatch.");
      } finally {
        setLoading(false);
      }
    }
    fetchPOs();
  }, []);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Saved Distributor POs
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and view all purchase orders
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          onClick={() => navigate("/distro-po/dashboard/form")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New PO
        </button>
      </div>

        {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading PO data...</span>
        </div>
      )}


      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <style>{`
                .htContainer {
                    position: relative;
                    z-index: 1 !important; 
                }
                .handsontable thead th {
                    z-index: 2 !important;
                }                  
                .handsontable {
                    font-family: inherit;
                    font-size: 0.85rem;
                  }
                  .handsontable thead th {
                    background-color: #f8fafc;
                    color: #475569;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                    text-align: left;
                  }
                  .handsontable tbody tr:hover td {
                    background-color: #f8fafc;
                  }
                  .handsontable td {
                    border-color: #f1f5f9;
                    padding: 0.25rem 0.5rem; 
                  }
                  .handsontable .htRowHeaders {
                      color: #94a3b8; 
                  }
                `}</style>
        <div style={{ width: "100%", minHeight: poList.length > 0 ? 300 : 0 }}>
          {!loading && !error && poList.length > 0 && (
            <HotTable
              ref={hotTableComponent}
              data={poList}
              colHeaders={columns.map((col) => col.title)}
              columns={columns}
              rowHeaders={true}
              pagination={{
                pageSize: "20",
              }}
              stretchH="all"
              licenseKey="non-commercial-and-evaluation"
              manualColumnResize={true}
              manualRowResize={true}
              filters={true}
              dropdownMenu={true}
              contextMenu={["copy", "cut", "filter_by_value", "alignment"]}
              height={500}
              className="htContainer htHandsontable"
              readOnly={true}
            />
          )}
        </div>
      </div>
      {!loading && !error && poList.length === 0 && (
        <EmptyState
          title="No PO Data Found"
          description="There are currently no purchase orders available to display."
        />
      )}
    </div>
  );
};

export default POList;
