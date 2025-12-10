import React, { useEffect, useState } from 'react';
import { getPOSummary } from '../../api/distro-po/summary';
import { DataGrid } from '@mui/x-data-grid';

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
    const summaryMap = {};
    rawRows.forEach(row => {
      const key = `${row.distributorName}-${row.month || ''}-${row.year}`;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          id: key,
          distributorName: row.distributorName,
          month: row.month,
          year: row.year,
        };
        vehicleIDs.forEach(vID => {
          summaryMap[key][vID] = 0;
        });
      }
      if (vehicleIDs.includes(row.vehicleID)) {
        summaryMap[key][row.vehicleID] += Number(row.qty) || 0;
      }
    });
    setRows(Object.values(summaryMap));
  }, [rawRows]);

  const columns = [
    { field: 'distributorName', headerName: 'Distributor', width: 180 },
    { field: 'month', headerName: 'Month', width: 100 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: '2W Ni', headerName: '2W Ni', width: 120, type: 'number', valueFormatter: params => (params.value != null ? Number(params.value).toLocaleString() : '') },
    { field: '2W PM', headerName: '2W PM', width: 120, type: 'number', valueFormatter: params => (params.value != null ? Number(params.value).toLocaleString() : '') },
    { field: '4W Ni', headerName: '4W Ni', width: 120, type: 'number', valueFormatter: params => (params.value != null ? Number(params.value).toLocaleString() : '') },
    { field: '4W PM', headerName: '4W PM', width: 120, type: 'number', valueFormatter: params => (params.value != null ? Number(params.value).toLocaleString() : '') },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">PO Summary by Distributor & Vehicle</h2>
      <div className="flex gap-4 mb-4">
        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="border p-2 rounded" placeholder="Year" min="2020" max="2100" />
        <select value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded">
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={row => row.id || `${row.distributorName}-${row.vehicleID}-${row.month || ''}-${row.year}`}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          sortingOrder={["desc", "asc"]}
        />
      </div>
    </div>
  );
};

export default POSummary;
