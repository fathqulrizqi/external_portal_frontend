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
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <DataTable
          data={rawRows}
          columns={columns}
          className="display"
          dt={DataTableLib}
          options={{
            paging: true,
            pageLength: 25,
            lengthMenu: [25, 50, 100],
            searching: true,
            ordering: true,
            info: true,
            responsive: true,
            autoWidth: false,
          }}
        />
      </div>
    </div>
  );
};

export default POSummary;
