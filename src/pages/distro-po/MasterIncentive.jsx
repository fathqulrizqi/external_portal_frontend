import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import {
  getAllMasterIncentives,
  createMasterIncentive,
  updateMasterIncentive,
  deleteMasterIncentive
} from '../../api/distro-po/masterincentive.js';
import { Button } from '../../components/ui/Button.jsx';

const columns = [
  { data: 'rangeFrom', type: 'numeric', title: 'Range From' },
  { data: 'rangeTo', type: 'numeric', title: 'Range To' },
  { data: 'vehicle', type: 'text', title: 'Vehicle' },
  { data: 'vehicleId', type: 'text', title: 'Vehicle ID' },
  { data: 'periodYear', type: 'numeric', title: 'Period Year' },
  { data: 'amount', type: 'numeric', title: 'Amount',
    numericFormat: { pattern: '0,0', culture: 'en-US' },
    renderer: (instance, td, row, col, prop, value) => {
      td.innerHTML = value !== null && value !== undefined && value !== '' ? Number(value).toLocaleString('en-US') : '';
      td.className = 'htRight';
    }
  },
];

export default function DistroPOIncentiveHotTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hotRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllMasterIncentives();
      setData(res.data);
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    const tableData = hotRef.current.hotInstance.getSourceData();
    try {
      // Truncate all existing incentives, then create new ones from tableData
      // 1. Delete all existing
      for (const row of data) {
        if (row.id) {
          await deleteMasterIncentive(row.id);
        }
      }
      // 2. Create all rows that have a valid rangeFrom (required field)
      for (const row of tableData) {
        if (row.rangeFrom !== undefined && row.rangeFrom !== null && row.rangeFrom !== '') {
          await createMasterIncentive(row);
        }
      }
      await fetchData();
    } catch (err) {
      setError('Failed to save changes');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Distro PO Incentive</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...Please Wait, it will take a moment' : 'Save'}
        </Button>
      </div>
      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={columns.map(col => col.title)}
        columns={columns}
        rowHeaders={true}
        width="100%"
        stretchH="all"
        minRows={5}
        licenseKey="non-commercial-and-evaluation"
        manualRowMove={true}
        manualColumnMove={true}
        contextMenu={true}
        className="htMiddle"
        filters={true}
        columnSorting={{ indicator: true }}
        dropdownMenu={true}
      />
    </div>
  );
}
