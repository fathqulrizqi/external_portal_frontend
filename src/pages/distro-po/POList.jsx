import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDistributorPOs } from '../../api/distro-po/distro-po';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const POList = () => {
  const navigate = useNavigate();
  const [poList, setPOList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPOs() {
      setLoading(true);
      const result = await getAllDistributorPOs();
      if (result.success) {
        setPOList(result.data.map((row, idx) => ({ ...row, id: row.uuid || idx })));
        setError('');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
    fetchPOs();
  }, []);

  const columns = [
    {
      field: 'number',
      headerName: 'Number',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (params.rowIndex !== undefined ? params.rowIndex + 1 : ''),
    },
    {
      field: 'poNumber',
      headerName: 'PO Number',
      width: 180,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate(`/distro-po/form/${params.row.uuid}`)}
        >
          {params.value}
        </Button>
      ),
      flex: 1,
    },
    {
      field: 'distributorName',
      headerName: 'Distributor',
      width: 180,
      flex: 1,
    },
    {
      field: 'customerCode',
      headerName: 'Customer Code',
      width: 140,
      flex: 1,
    },
    {
      field: 'poDate',
      headerName: 'Date',
      width: 120,
      valueFormatter: (params) => params.value ? params.value.slice(0, 10) : '',
      flex: 1,
    },
    {
      field: 'niterraSO',
      headerName: 'Niterra SO',
      width: 140,
      flex: 1,
    },
    {
      field: 'niterraPO',
      headerName: 'Niterra PO',
      width: 140,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 120,
      valueFormatter: (params) => params.value ? params.value.slice(0, 10) : '',
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 120,
      valueFormatter: (params) => params.value ? params.value.slice(0, 10) : '',
      flex: 1,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Saved Distributor POs</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/distro-po/form')}
        >
          + Create New PO
        </Button>
      </div>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={poList}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          disableSelectionOnClick
          sortingOrder={["asc", "desc"]}
          filterMode="client"
          sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}
          autoHeight={false}
        />
      </div>
    </div>
  );
};

export default POList;
