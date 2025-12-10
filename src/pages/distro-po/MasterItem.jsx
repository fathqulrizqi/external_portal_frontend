import React, { useEffect, useState, useRef } from 'react';
import { getMasterItems, createMasterItem, updateMasterItem, deleteMasterItem } from '../../api/distro-po/masteritem';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { Box, Typography, Snackbar, Alert, Button } from '@mui/material';

const columns = [
  { data: 'vehicle', type: 'text', title: 'Vehicle' },
  { data: 'vehicleId', type: 'text', title: 'Vehicle ID' },
  { data: 'category', type: 'text', title: 'Category' },
  { data: 'productName', type: 'text', title: 'Product Name' },
  { data: 'spType', type: 'text', title: 'SP Type' },
  { data: 'itemId', type: 'text', title: 'Item ID' },
  { data: 'isActive', type: 'checkbox', title: 'Active' },
  { data: 'price', type: 'numeric', title: 'Price' },
];

export default function MasterItemPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const hotTableComponent = useRef(null);

  useEffect(() => {
    setLoading(true);
    getMasterItems()
      .then(items => {
        // Ensure items is always an array of objects
        if (Array.isArray(items)) {
          setData(items);
        } else {
          setData([]);
        }
        setError('');
      })
      .catch(() => {
        setError('Failed to fetch items');
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAfterChange = async (changes, source) => {
    if (source === 'edit' && changes) {
      for (const change of changes) {
        const [rowIdx, prop, oldValue, newValue] = change;
        const row = data[rowIdx];
        if (row && row[prop] !== newValue) {
          try {
            await updateMasterItem(row.id, { ...row, [prop]: newValue });
            setSnackbar({ open: true, message: 'Row updated', severity: 'success' });
            const items = await getMasterItems();
            setData(items);
          } catch {
            setSnackbar({ open: true, message: 'Failed to update row', severity: 'error' });
          }
        }
      }
    }
  };

  const handleAddRow = async () => {
    const hot = hotTableComponent.current.hotInstance;
    const newRow = {};
    columns.forEach(col => {
      // Use correct default type for each column
      if (col.type === 'checkbox') {
        newRow[col.data] = false;
      } else if (col.type === 'numeric') {
        newRow[col.data] = 0;
      } else {
        newRow[col.data] = '';
      }
    });
    try {
      await createMasterItem(newRow);
      setSnackbar({ open: true, message: 'Row added', severity: 'success' });
      const items = await getMasterItems();
      setData(items);
      // Optionally, scroll to the new row
      setTimeout(() => {
        hot.scrollViewportTo(data.length, 0);
      }, 300);
    } catch {
      setSnackbar({ open: true, message: 'Failed to add row', severity: 'error' });
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    const row = data[rowIndex];
    if (!row || !row.id) return;
    try {
      await deleteMasterItem(row.id);
      setSnackbar({ open: true, message: 'Row deleted', severity: 'success' });
      const items = await getMasterItems();
      setData(items);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete row', severity: 'error' });
    }
  };

  // Add a custom renderer for the delete button
  const hotColumns = [
    ...columns,
    {
      data: 'delete',
      title: 'Delete',
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        td.innerHTML = '<button style="color: white; background: #d32f2f; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">Delete</button>';
        td.onclick = () => handleDeleteRow(row);
        return td;
      },
      readOnly: true,
      width: 90,
    },
  ];
  // Save all rows to API
        const handleSaveAll = async () => {
    let success = true;
    // Upsert each row: update if id exists, create if not and itemId is unique in the current data
    const existingItemIds = new Set(data.filter(r => r.id).map(r => r.itemId));
    for (const row of data) {
      if (row && typeof row === 'object') {
        const {
          vehicle,
          vehicleId,
          category,
          productName,
          spType,
          itemId,
          isActive,
          price
        } = row;
        try {
          if (row.id) {
            await updateMasterItem(row.id, {
              vehicle,
              vehicleId,
              category,
              productName,
              spType,
              itemId,
              isActive,
              price
            });
          } else if (!existingItemIds.has(itemId)) {
            await createMasterItem({
              vehicle,
              vehicleId,
              category,
              productName,
              spType,
              itemId,
              isActive,
              price
            });
            existingItemIds.add(itemId);
          }
        } catch {
          success = false;
        }
      }
    }
    if (success) {
      setSnackbar({ open: true, message: 'All changes saved', severity: 'success' });
      const items = await getMasterItems();
      if (Array.isArray(items)) {
        setData(items);
      } else {
        setData([]);
      }
    } else {
      setSnackbar({ open: true, message: 'Some changes failed to save', severity: 'error' });
    }
        };

  return (
    <Box maxWidth="lg" mx="auto" p={4} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Typography variant="h4" mb={3} color="primary">Master Item</Typography>
      <Button variant="contained" color="primary" onClick={handleSaveAll} sx={{ mb: 2 }}>Save</Button>
      <div style={{ width: '100%', minHeight: 500 }}>
        <HotTable
          ref={hotTableComponent}
          data={data}
          colHeaders={hotColumns.map(col => col.title)}
          columns={hotColumns}
          rowHeaders={true}
          stretchH="all"
          licenseKey="non-commercial-and-evaluation"
          afterChange={handleAfterChange}
          manualColumnResize={true}
          manualRowResize={true}
          filters={true}
          dropdownMenu={true}
          contextMenu={true}
          height={500}
          minRows={1}
          minSpareRows={0}
          loading={loading}
        />
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
