import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import {
  getAllMasterAchievements,
  createMasterAchievement,
  updateMasterAchievement,
  deleteMasterAchievement
} from '../../api/distro-po/masterAchievement';
import { getAllCompanies } from '../../api/company/list';
import { Button } from '../../components/ui/Button.jsx';


export default function MasterAchievementHotTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const hotRef = useRef(null);

  // Prepare columns with dropdown and read-only logic
  const columns = [
    {
      data: 'customerCode',
      type: 'text',
      title: 'Customer Code',
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        td.innerHTML = value || '';
      },
    },
    {
      data: 'customerName',
      type: 'dropdown',
      title: 'Customer Name',
      source: companies.map(c => c.companyName).filter(Boolean),
      strict: true,
      allowInvalid: false,
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        td.innerHTML = value || '';
        td.className = 'htDropdown';
      },
    },
    {
      data: 'city',
      type: 'text',
      title: 'City',
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        td.innerHTML = value || '';
      },
    },
    {
      data: 'targetQty',
      type: 'numeric',
      title: 'Target QTY',
      numericFormat: { pattern: '0,0', culture: 'en-US' },
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        if (value !== null && value !== undefined && value !== '') {
          td.innerHTML = Number(value).toLocaleString('en-US');
        } else {
          td.innerHTML = '';
        }
        td.className = 'htRight';
      },
    },
    {
      data: 'targetAmount',
      type: 'numeric',
      title: 'Target Amount',
      numericFormat: { pattern: '0,0', culture: 'en-US' },
      renderer: (instance, td, row, col, prop, value, cellProperties) => {
        if (value !== null && value !== undefined && value !== '') {
          td.innerHTML = Number(value).toLocaleString('en-US');
        } else {
          td.innerHTML = '';
        }
        td.className = 'htRight';
      },
    },
    { data: 'vehicle', type: 'text', title: 'Vehicle' },
    { data: 'vehicleId', type: 'text', title: 'Vehicle ID' },
    { data: 'periodYear', type: 'numeric', title: 'Period Year' },
  ];


  useEffect(() => {
    fetchData();
    fetchCompanies();
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

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompanies("Distro-PO");
      setCompanies(res.data);
    } catch (err) {
      setCompanies([]);
    }
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    const tableData = hotRef.current.hotInstance.getSourceData();
    try {
      // Truncate all existing MasterAchievement records, then create new ones from tableData
      // 1. Delete all existing
      for (const row of data) {
        if (row.id) {
          await deleteMasterAchievement(row.id);
        }
      }
      // 2. Create all rows that have a customerCode (required field)
      for (const row of tableData) {
        if (row.customerCode) {
          await createMasterAchievement(row);
        }
      }
      await fetchData();
    } catch (err) {
      setError('Failed to save changes');
    }
    setLoading(false);
  };

  // Autofill customerCode and city when customerName changes
  const handleAfterChange = (changes, source) => {
    if (!changes || source === 'loadData') return;
    const hot = hotRef.current.hotInstance;
    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (prop === 'customerName' && newValue && newValue !== oldValue) {
        const company = companies.find(c => c.companyName === newValue);
        if (company) {
          hot.setDataAtCell(row, columns.findIndex(c => c.data === 'customerCode'), company.companyCode || '');
          hot.setDataAtCell(row, columns.findIndex(c => c.data === 'city'), company.companyCity || '');
        } else {
          hot.setDataAtCell(row, columns.findIndex(c => c.data === 'customerCode'), '');
          hot.setDataAtCell(row, columns.findIndex(c => c.data === 'city'), '');
        }
      }
    });
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
        afterChange={handleAfterChange}
        filters={true}
        columnSorting={{ indicator: true }}
        dropdownMenu={true}
      />
    </div>
  );
}
