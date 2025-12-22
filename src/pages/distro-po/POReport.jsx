  // Format number with comma delimiter
  function formatNumber(n) {
    if (typeof n === 'number') return n.toLocaleString('en-US');
    if (typeof n === 'string' && n !== '' && !isNaN(n)) return Number(n).toLocaleString('en-US');
    return n;
  }
import React, { useState, useEffect } from 'react';
import { API } from '../../api/index.js';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.min.css';
import Select from 'react-select';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function POReport() {
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState('qty');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch only active Distro-PO companies from backend API
    API.get('/company?application=distro-po&companyStatus=Active').then(res => {
      let companies = [];
      if (Array.isArray(res.data)) {
        companies = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        companies = res.data.data;
      }
      setDistributors(companies);
    }).catch(() => setDistributors([]));
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map selected distributor values (companyCode) to companyName for API
      const selectedNames = (Array.isArray(selectedDistributors) && selectedDistributors.length > 0)
        ? selectedDistributors.map(code => {
          const found = distributors.find(d => d.companyCode === code);
          return found ? found.companyName : null;
        }).filter(Boolean)
        : [];
      const params = {
        distributors: JSON.stringify(selectedNames),
        year: Number(year),
        type
      };
      const res = await API.get('/distro-po/report/report', { params });
      setReport(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to fetch report');
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  // Map report data to flat objects for Handsontable
  const getTableRows = () => {
    if (!Array.isArray(report)) return [];
    const rows = [];
    // Group rows by distributor
    const distributorGroups = {};
    report.forEach(row => {
      if (!distributorGroups[row.distributor]) distributorGroups[row.distributor] = [];
      distributorGroups[row.distributor].push(row);
    });
    Object.entries(distributorGroups).forEach(([distributor, group]) => {
      // Add all vehicle rows for this distributor
      group.forEach(row => {
        // Plan row
        rows.push({
          distributor: row.distributor || '',
          vehicle: row.vehicle || '',
          vehicleID: row.vehicleID || '',
          type: 'Plan',
          ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, Array.isArray(row.plan) ? formatNumber(row.plan[i]) : ''])),
          ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, Array.isArray(row.planQ) ? formatNumber(row.planQ[i]) : ''])),
          year: row.planYear != null ? formatNumber(row.planYear) : '',
        });
        // Actual row
        rows.push({
          distributor: row.distributor || '',
          vehicle: row.vehicle || '',
          vehicleID: row.vehicleID || '',
          type: 'Actual',
          ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, Array.isArray(row.actual) ? formatNumber(row.actual[i]) : ''])),
          ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, Array.isArray(row.actualQ) ? formatNumber(row.actualQ[i]) : ''])),
          year: row.actualYear != null ? formatNumber(row.actualYear) : '',
        });
        // Percentage row
        rows.push({
          distributor: row.distributor || '',
          vehicle: row.vehicle || '',
          vehicleID: row.vehicleID || '',
          type: 'Percentage',
          ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, Array.isArray(row.percentage) ? `${formatNumber(row.percentage[i])}%` : ''])),
          ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, Array.isArray(row.percentageQ) ? `${formatNumber(row.percentageQ[i])}%` : ''])),
          year: row.percentageYear != null ? `${formatNumber(row.percentageYear)}%` : '',
        });
      });
      // Add Total row for this distributor (sum all vehicles)
      const totalPlan = Array(12).fill(0);
      const totalPlanQ = [0, 0, 0, 0];
      let totalPlanYear = 0;
      const totalActual = Array(12).fill(0);
      const totalActualQ = [0, 0, 0, 0];
      let totalActualYear = 0;
      const totalPercentage = Array(12).fill(0);
      const totalPercentageQ = [0, 0, 0, 0];
      let totalPercentageYear = 0;
      group.forEach(row => {
        for (let i = 0; i < 12; i++) {
          totalPlan[i] += row.plan[i] || 0;
          totalActual[i] += row.actual[i] || 0;
        }
        for (let i = 0; i < 4; i++) {
          totalPlanQ[i] += row.planQ[i] || 0;
          totalActualQ[i] += row.actualQ[i] || 0;
        }
        totalPlanYear += row.planYear || 0;
        totalActualYear += row.actualYear || 0;
      });
      // Calculate percentages for total
      for (let i = 0; i < 12; i++) {
        totalPercentage[i] = totalPlan[i] ? Math.round((totalActual[i] / totalPlan[i]) * 100) : 0;
      }
      for (let i = 0; i < 4; i++) {
        totalPercentageQ[i] = totalPlanQ[i] ? Math.round((totalActualQ[i] / totalPlanQ[i]) * 100) : 0;
      }
      totalPercentageYear = totalPlanYear ? Math.round((totalActualYear / totalPlanYear) * 100) : 0;
      // Add Total rows
      rows.push({
        distributor,
        vehicle: 'Total',
        vehicleID: '',
        type: 'Plan',
        ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, formatNumber(totalPlan[i])])),
        ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, formatNumber(totalPlanQ[i])])),
        year: formatNumber(totalPlanYear),
      });
      rows.push({
        distributor,
        vehicle: 'Total',
        vehicleID: '',
        type: 'Actual',
        ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, formatNumber(totalActual[i])])),
        ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, formatNumber(totalActualQ[i])])),
        year: formatNumber(totalActualYear),
      });
      rows.push({
        distributor,
        vehicle: 'Total',
        vehicleID: '',
        type: 'Percentage',
        ...Object.fromEntries(months.map((m, i) => [`month${i + 1}`, `${formatNumber(totalPercentage[i])}%`])),
        ...Object.fromEntries(quarters.map((q, i) => [`quarter${i + 1}`, `${formatNumber(totalPercentageQ[i])}%`])),
        year: `${formatNumber(totalPercentageYear)}%`,
      });
    });
    return rows;
  };

  // Define columns for Handsontable
  const tableColumns = [
    { data: 'distributor', title: 'Distributor', readOnly: true, className: 'htNoWrap' },
    { data: 'vehicle', title: 'Vehicle', readOnly: true },
    { data: 'vehicleID', title: 'VehicleID', readOnly: true },
    { data: 'type', title: 'Type', readOnly: true },
    ...months.map((m, i) => ({ data: `month${i + 1}`, title: m, type: 'numeric', readOnly: true })),
    ...quarters.map((q, i) => ({ data: `quarter${i + 1}`, title: q, type: 'numeric', readOnly: true })),
    { data: 'year', title: '1 Year', type: 'numeric', readOnly: true },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Distro-PO Achievement Report</h2>
      <div className="mb-4 flex gap-4 flex-wrap">
        <div className="min-w-[200px]">
          <label>Distributor:</label><br />
          <Select
            isMulti
            options={(Array.isArray(distributors) ? distributors : []).map(d => ({ value: d.companyCode, label: d.companyName }))}
            value={selectedDistributors.map(val => {
              const found = distributors.find(d => d.companyCode === val);
              return found ? { value: found.companyCode, label: found.companyName } : null;
            }).filter(Boolean)}
            onChange={opts => setSelectedDistributors(opts ? opts.map(o => o.value) : [])}
            classNamePrefix="react-select"
            className="z-999"
            placeholder="Select distributors..."
          />
        </div>
        <div className="min-w-[120px]">
          <label>Year:</label><br />
          <Select
            options={[2023, 2024, 2025].map(y => ({ value: y, label: y }))}
            value={{ value: year, label: year }}
            onChange={opt => setYear(opt ? opt.value : new Date().getFullYear())}
            classNamePrefix="react-select"
            className="z-999"
            isSearchable={false}
            placeholder="Select year..."
          />
        </div>
        <div>
          <label>Type:</label><br />
          <label><input type="radio" name="type" value="qty" checked={type === 'qty'} onChange={() => setType('qty')} /> By QTY</label>
          <label className="ml-2"><input type="radio" name="type" value="amount" checked={type === 'amount'} onChange={() => setType('amount')} /> By Amount</label>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded self-end" onClick={fetchReport}>Filter</button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading report...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <HotTable
            data={getTableRows()}
            columns={tableColumns}
            colHeaders={tableColumns.map(col => col.title)}
            rowHeaders={true}
            width="100%"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            className="htTable"
            height={500}
            minRows={3}
            pagination={{
              pageSize: '50',
            }}
            minSpareRows={0}
            columnSorting={false}
            contextMenu={['row_above', 'row_below', 'remove_row', 'undo', 'redo']}
            cells={(row, col, prop) => {
              const tableRows = getTableRows();
              if (tableRows[row]) {
                // Color for Percentage rows and also for Total-Percentage rows
                const isPercentageRow = tableRows[row].type === 'Percentage';
                const isTotalRow = tableRows[row].vehicle === 'Total';
                const percentageColumns = [
                  ...months.map((m, i) => `month${i + 1}`),
                  ...quarters.map((q, i) => `quarter${i + 1}`),
                  'year'
                ];
                if (isPercentageRow && percentageColumns.includes(prop)) {
                  // Remove % and commas, parse as number
                  let val = tableRows[row][prop];
                  if (typeof val === 'string') {
                    val = val.replace(/,/g, '').replace('%', '');
                  }
                  val = Number(val);
                  if (!isNaN(val)) {
                    if (val <= 50) return { className: (isTotalRow ? 'htBold htTotalRow ' : '') + 'htPercentageLow' };
                    if (val >= 51 && val <= 99) return { className: (isTotalRow ? 'htBold htTotalRow ' : '') + 'htPercentageMid' };
                    if (val >= 100) return { className: (isTotalRow ? 'htBold htTotalRow ' : '') + 'htPercentageHigh' };
                  }
                  return { className: (isTotalRow ? 'htBold htTotalRow ' : '') + 'htPercentageRow' };
                }
                if (isTotalRow) {
                  return { className: 'htBold htTotalRow' };
                }
                if (tableRows[row].type === 'Actual') {
                  return { className: 'htAltRow' };
                }
              }
              return {};
            }}
          />
        )}
      </div>
      <style>{`
      .htBold {
        font-weight: bold !important;
      }
      .htNoWrap {
        white-space: nowrap !important;
      }
      .htTotalRow {
        background-color: #e3f2fd !important;
      }
      .htPercentageRow {
        background-color: #fffde7 !important;
      }
      .htPercentageLow {
        background-color: #ffebee !important;
        color: #c62828 !important;
        font-weight: bold;
      }
      .htPercentageMid {
        background-color: #fffde7 !important;
        color: #f9a825 !important;
        font-weight: bold;
      }
      .htPercentageHigh {
        background-color: #e8f5e9 !important;
        color: #2e7d32 !important;
        font-weight: bold;
      }
      .htAltRow {
        background-color: #f5f5f5 !important;
      }
      .htTable .htCore td {
        border: 1px solid #e0e0e0;
      }
      // .htTable .htCore th {
      //   background: #1976d2;
      //   color: #fff;
      //   font-weight: bold;
      //   border: 1px solid #1976d2;
      // }
    `}</style>
    </div>
  );
}

