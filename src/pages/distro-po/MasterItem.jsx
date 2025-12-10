// Custom renderer for price column to add comma delimiter
function priceCommaRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (typeof value === 'number' && !isNaN(value)) {
    td.textContent = value.toLocaleString('en-US');
  } else if (typeof value === 'string' && value !== '' && !isNaN(Number(value))) {
    td.textContent = Number(value).toLocaleString('en-US');
  }
}
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
  { data: 'price', type: 'numeric', title: 'Price', renderer: priceCommaRenderer, className: 'htRight' },
];

export default function MasterItemPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false); // <-- Add saving state
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
      setUnsaved(true);
      // Do not auto-save, just mark as unsaved
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
  const hotColumns = [...columns]; // Use only the main columns, no custom delete column
  // Save all rows to API
  const handleSaveAll = async () => {
    setSaving(true);
    let success = true;
    // Upsert each row: update if id exists, create if not
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
          } else {
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
      setUnsaved(false);
    } else {
      setSnackbar({ open: true, message: 'Some changes failed to save', severity: 'error' });
    }
    setSaving(false);
  };

  return (
    <Box maxWidth="lg" mx="auto" p={4} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Typography variant="h4" mb={3} color="primary">Master Item</Typography>
      {unsaved && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You have unsaved changes.
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveAll}
        sx={{ mb: 2 }}
        disabled={saving}
      >
        {saving ? 'Saving...Please wait' : 'Save'}
      </Button>
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
