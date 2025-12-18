import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import {
  getAllMasterAchievements,
  createMasterAchievement,
  updateMasterAchievement,
  deleteMasterAchievement
} from '../../api/distro-po/masterAchievement';
import { Button } from '../../components/ui/Button.jsx';

const columns = [
  { data: 'customerCode', type: 'text', title: 'Customer Code' },
  { data: 'customerName', type: 'text', title: 'Customer Name' },
  { data: 'city', type: 'text', title: 'City' },
  { data: 'targetQty', type: 'numeric', title: 'Target QTY' },
  { data: 'targetAmount', type: 'numeric', title: 'Target Amount' },
  { data: 'vehicle', type: 'text', title: 'Vehicle' },
  { data: 'vehicleId', type: 'text', title: 'Vehicle ID' },
  { data: 'periodYear', type: 'numeric', title: 'Period Year' },
];

export default function MasterAchievementHotTable() {
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
      const res = await getAllMasterAchievements();
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
      // Find new, updated, and deleted rows
      // For simplicity, send all rows as upserts, and delete missing ones
      const existingIds = data.map(row => row.id).filter(Boolean);
      const newRows = tableData.filter(row => !row.id && row.customerCode);
      const updatedRows = tableData.filter(row => row.id);
      const deletedIds = existingIds.filter(id => !tableData.some(row => row.id === id));

      // Create new
      for (const row of newRows) {
        await createMasterAchievement(row);
      }
      // Update existing
      for (const row of updatedRows) {
        await updateMasterAchievement(row.id, row);
      }
      // Delete removed
      for (const id of deletedIds) {
        await deleteMasterAchievement(id);
      }
      await fetchData();
    } catch (err) {
      setError('Failed to save changes');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Master Achievement</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
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
      />
    </div>
  );
}
