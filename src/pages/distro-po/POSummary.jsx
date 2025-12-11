import React, { useEffect, useState } from 'react';
import { getPOSummary } from '../../api/distro-po/summary';
import DataTable from 'datatables.net-react';
import DataTableLib from 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

const POSummary = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [rawRows, setRawRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPOSummary({ year, month: month || undefined }).then(data => {
      setRawRows(data);
      setLoading(false);
    });
  }, [year, month]);

  useEffect(() => {
    // Aggregate by distributor, month, year
    const vehicleIDs = ["2W Ni", "2W PM", "4W Ni", "4W PM"];
    const vehicleIDsNorm = vehicleIDs.map(v => v.trim().toLowerCase());
    const summaryMap = {};
    rawRows.forEach(row => {
      // Derive month from PODate if missing
      let month = row.month;
      let year = row.year;
      if ((!month || !year) && row.PODate) {
        const date = new Date(row.PODate);
        if (!isNaN(date.getTime())) {
          month = date.getMonth() + 1;
          year = date.getFullYear();
        }
      }
      // Normalize vehicleID (trim, case)
      const vehicleIDRaw = (row.vehicleID || '').trim();
      const vehicleIDNorm = vehicleIDRaw.toLowerCase();
      const key = `${row.distributorName}-${month || ''}-${year}`;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          id: key,
          distributorName: row.distributorName,
          month: month,
          year: year,
        };
        vehicleIDs.forEach(vID => {
          summaryMap[key][vID] = 0;
        });
      }
      // Find the matching vehicleID from the reference list
      const idx = vehicleIDsNorm.indexOf(vehicleIDNorm);
      if (idx !== -1) {
        const vID = vehicleIDs[idx];
        summaryMap[key][vID] += Number(row.qty) || 0;
      }
    });
    setRows(Object.values(summaryMap));
  }, [rawRows]);

  const columns = [
    { title: 'Distributor', data: 'distributorName' },
    { title: 'Month', data: 'month', render: (data) => {
        const monthNum = typeof data === 'string' ? parseInt(data, 10) : Number(data);
        if (!data || isNaN(monthNum) || monthNum < 1 || monthNum > 12) return 'All';
        const date = new Date(2000, monthNum - 1, 1);
        return date.toLocaleString('en-US', { month: 'short' });
      }
    },
    { title: 'Year', data: 'year' },
    { title: '2W Ni', data: '2W Ni', render: (data) => data != null ? Number(data).toLocaleString() : '' },
    { title: '2W PM', data: '2W PM', render: (data) => data != null ? Number(data).toLocaleString() : '' },
    { title: '4W Ni', data: '4W Ni', render: (data) => data != null ? Number(data).toLocaleString() : '' },
    { title: '4W PM', data: '4W PM', render: (data) => data != null ? Number(data).toLocaleString() : '' },
  ];

  // Calculate totals for stats
  const totals = rows.reduce((acc, row) => {
    acc.total2WNi += Number(row['2W Ni']) || 0;
    acc.total2WPM += Number(row['2W PM']) || 0;
    acc.total4WNi += Number(row['4W Ni']) || 0;
    acc.total4WPM += Number(row['4W PM']) || 0;
    acc.grandTotal += acc.total2WNi + acc.total2WPM + acc.total4WNi + acc.total4WPM;
    return acc;
  }, { total2WNi: 0, total2WPM: 0, total4WNi: 0, total4WPM: 0, grandTotal: 0 });

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">PO Summary</h2>
          <p className="text-gray-600 text-sm mt-1">Analyze purchase orders by distributor and vehicle type</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
          onClick={() => {
            const csvContent = [
              ['Distributor', 'Month', 'Year', '2W Ni', '2W PM', '4W Ni', '4W PM'],
              ...rows.map(row => [
                row.distributorName,
                row.month || 'All',
                row.year,
                row['2W Ni'] || 0,
                row['2W PM'] || 0,
                row['4W Ni'] || 0,
                row['4W PM'] || 0
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `po-summary-${year}-${month || 'all'}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Summary</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input 
              type="number" 
              value={year} 
              onChange={e => setYear(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
              placeholder="Year" 
              min="2020" 
              max="2100" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select 
              value={month} 
              onChange={e => setMonth(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(2000, i, 1).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-all duration-200"
              onClick={() => {
                setYear(new Date().getFullYear());
                setMonth('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">2W Nickel</p>
              <p className="text-2xl font-bold text-gray-800">{totals.total2WNi.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">2W PM</p>
              <p className="text-2xl font-bold text-gray-800">{totals.total2WPM.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">4W Nickel</p>
              <p className="text-2xl font-bold text-gray-800">{totals.total4WNi.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">4W PM</p>
              <p className="text-2xl font-bold text-gray-800">{totals.total4WPM.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Grand Total</p>
              <p className="text-2xl font-bold text-gray-800">{totals.grandTotal.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
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

      {/* DataTable */}
      {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <style>{`
            .dataTables_wrapper {
              padding: 1rem;
            }
            .dataTables_wrapper .dataTables_length {
              margin-bottom: 1rem;
            }
            .dataTables_wrapper .dataTables_filter {
              margin-bottom: 1rem;
            }
            .dataTables_wrapper .dataTables_info {
              margin-top: 1rem;
            }
            .dataTables_wrapper .dataTables_paginate {
              margin-top: 1rem;
            }
            .display.dataTable thead th {
              background-color: #f8fafc;
              color: #475569;
              font-weight: 600;
              border-bottom: 1px solid #e2e8f0;
              padding: 0.75rem 1rem;
            }
            .display.dataTable tbody tr {
              transition: background-color 0.2s ease;
            }
            .display.dataTable tbody tr:hover {
              background-color: #f8fafc;
            }
            .display.dataTable tbody td {
              padding: 0.75rem 1rem;
              border-bottom: 1px solid #f1f5f9;
            }
            .display.dataTable tbody tr:last-child td {
              border-bottom: none;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button {
              padding: 0.5rem 0.75rem;
              margin: 0 0.125rem;
              border-radius: 0.375rem;
              border: 1px solid #e2e8f0;
              background: white;
              color: #475569;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button.current {
              background: #3b82f6;
              color: white;
              border-color: #3b82f6;
            }
            .dataTables_wrapper .dataTables_filter input {
              border: 1px solid #e2e8f0;
              border-radius: 0.375rem;
              padding: 0.5rem 0.75rem;
              margin-left: 0.5rem;
            }
            .dataTables_wrapper .dataTables_filter input:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .dataTables_wrapper .dataTables_length select {
              border: 1px solid #e2e8f0;
              border-radius: 0.375rem;
              padding: 0.5rem 0.75rem;
              margin-left: 0.5rem;
            }
            .dataTables_wrapper .dataTables_length select:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
          `}</style>
          <DataTable
            data={rows}
            columns={columns}
            className="display"
            dt={DataTableLib}
            options={{
              paging: true,
              pageLength: 25,
              lengthMenu: [10, 25, 50, 100],
              searching: true,
              ordering: true,
              info: true,
              responsive: true,
              autoWidth: false,
              language: {
                search: "Search:",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                paginate: {
                  first: "First",
                  last: "Last",
                  next: "Next",
                  previous: "Previous"
                }
              }
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && rows.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No summary data available</h3>
          <p className="text-gray-600">Try adjusting the filters or check if there are POs for the selected period.</p>
        </div>
      )}
    </div>
  );
};

export default POSummary;