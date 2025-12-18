import React, { useEffect, useState, useRef } from "react";
import { HotTable } from "@handsontable/react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import EmptyState from "../../components/ui/Loading-Table";
//import { getPOSummary } from '../../utils/constants/summary';
import { getPOSummary } from "../../api/distro-po/distro-po";

function numberCommaRenderer(
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
  if (value != null && !isNaN(Number(value))) {
    td.textContent = Number(value).toLocaleString("en-US");
  } else {
    td.textContent = "";
  }
  td.className += " htRight";
}

// Custom renderer untuk format Bulan
function monthShortRenderer(
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

  const monthNum =
    typeof value === "string" ? parseInt(value, 10) : Number(value);

  if (!value || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    td.textContent = "All";
  } else {
    const date = new Date(2000, monthNum - 1, 1);
    td.textContent = date.toLocaleString("en-US", { month: "short" });
  }
}

const POSummary = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const hotTableComponent = useRef(null);

  useEffect(() => {
    setLoading(true);
    const monthToSend = month === "" ? undefined : Number(month);
    getPOSummary({ year: Number(year), month: monthToSend })
      .then((result) => {
        if (Array.isArray(result)) {
          setRows(result);
        } else if (result && Array.isArray(result.data)) {
          setRows(result.data);
        } else {
          setRows([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch PO Summary:", err);
        setLoading(false);
      });
  }, [year, month]);

  const columns = [
    { data: "distributorName", type: "text", title: "Distributor" },
    {
      data: "month",
      type: "numeric",
      title: "Month",
      renderer: monthShortRenderer,
      width: 80,
    },
    { data: "year", type: "numeric", title: "Year", width: 80 },
    {
      data: "2W Ni",
      type: "numeric",
      title: "2W Ni",
      renderer: numberCommaRenderer,
    },
    {
      data: "2W PM",
      type: "numeric",
      title: "2W PM",
      renderer: numberCommaRenderer,
    },
    {
      data: "4W Ni",
      type: "numeric",
      title: "4W Ni",
      renderer: numberCommaRenderer,
    },
    {
      data: "4W PM",
      type: "numeric",
      title: "4W PM",
      renderer: numberCommaRenderer,
    },
  ];

  const totals = rows.reduce(
    (acc, row) => {
      acc.total2WNi += Number(row["2W Ni"]) || 0;
      acc.total2WPM += Number(row["2W PM"]) || 0;
      acc.total4WNi += Number(row["4W Ni"]) || 0;
      acc.total4WPM += Number(row["4W PM"]) || 0;
      return {
        ...acc,
        grandTotal:
          acc.total2WNi + acc.total2WPM + acc.total4WNi + acc.total4WPM,
      };
    },
    { total2WNi: 0, total2WPM: 0, total4WNi: 0, total4WPM: 0, grandTotal: 0 }
  );

  const handleExportData = () => {
    const hot = hotTableComponent.current.hotInstance;
    const exportPlugin = hot.getPlugin("exportFile");
    exportPlugin.exportToFile("csv", {
      filename: `po-summary-${year}-${month || "all"}`,
      mimeType: "text/csv",
      fileExtension: "csv",
      columnHeaders: true,
      rowHeaders: false,
    });
  };

  const months = [...Array(12)].map((_, i) => ({
    value: i + 1,
    name: new Date(2000, i, 1).toLocaleString("en-US", { month: "long" }),
  }));

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">PO Summary</h2>
          <p className="text-gray-600 text-sm mt-1">
            Analyze purchase orders by distributor and vehicle type
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
          onClick={handleExportData} // Gunakan fungsi export Handsontable
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filter Summary
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Year"
              min="2020"
              max="2100"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">All Months</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-all duration-200"
              onClick={() => {
                setYear(new Date().getFullYear());
                setMonth("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards (Tidak berubah) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* ... (Cards tetap sama) ... */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">2W Nickel</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.total2WNi.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-motorcycle text-blue-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">2W PM</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.total2WPM.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="rotate(45 12 12)">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3h2M10 5h4M10 8h4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 11h6V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11l-1 2v3h10v-3l-1-2H8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 16v3m4-3v3M11 21h2m-4-2h6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19v2m3-2l-1 1"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">4W Nickel</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.total4WNi.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-car text-purple-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">4W PM</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.total4WPM.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-car text-orange-600"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Grand Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {totals.grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="fa-solid fa-chart-simple text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading summary data...</span>
        </div>
      )}

      {/* Handsontable (Mengganti DataTable) */}
      {!loading && rows.length > 0 && (
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
                        padding: 0.75rem 1rem;
                      }
                      .handsontable .htRight {
                        text-align: right;
                      }
                    `}</style>
          <div style={{ width: "100%", minHeight: 300 }}>
            <HotTable
              ref={hotTableComponent}
              data={rows}
              colHeaders={columns.map((col) => col.title)}
              columns={columns}
              rowHeaders={true}
              stretchH="all"
              pagination={{
                pageSize: "10",
              }}
              licenseKey="non-commercial-and-evaluation"
              manualColumnResize={true}
              manualRowResize={true}
              filters={true}
              dropdownMenu={true}
              contextMenu={["copy", "cut", "filter_by_value", "alignment"]}
              height={500}
              className="htContainer htHandsontable"
              readOnly={true} // Tabel ini hanya untuk display
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && rows.length === 0 && (
        <EmptyState
          title="No summary data available"
          description="Try adjusting the filters or check if there are POs for the selected period."
        />
      )}
    </div>
  );
};

export default POSummary;
