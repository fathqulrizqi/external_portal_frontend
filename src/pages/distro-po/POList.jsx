
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDistributorPOs } from '../../api/distro-po/distro-po';
import DataTable from 'datatables.net-react';
import DataTableLib from 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
DataTable.use(DataTableLib);
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
    { title: 'No', data: null, orderable: false, render: function (data, type, row, meta) {
      // DataTables will always pass the correct visible row index in meta.row
      return meta.row + 1;
    } },
    { title: 'PO Number', data: 'poNumber', render: (data, type, row) => `<a href="/distro-po/dashboard/form/${row.uuid}" class='text-blue-600 underline'>${data}</a>` },
    { title: 'Distributor', data: 'distributorName' },
    { title: 'Customer Code', data: 'customerCode' },
    { title: 'Date', data: 'poDate', render: (data) => {
        if (!data) return '';
        const date = new Date(data);
        if (isNaN(date.getTime())) return data;
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      }
    },
    { title: 'Niterra SO', data: 'niterraSO' },
    { title: 'Niterra PO', data: 'niterraPO' },
    { title: 'Created At', data: 'createdAt', render: (data) => data ? data.slice(0, 10) : '' },
    { title: 'Updated At', data: 'updatedAt', render: (data) => data ? data.slice(0, 10) : '' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Saved Distributor POs</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/distro-po/dashboard/form')}
        >
          + Create New PO
        </button>
      </div>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}
      <div className="overflow-x-auto bg-white rounded-lg shadow" style={{ fontSize: '0.85rem' }}>
        <style>{`
          .display.dataTable tbody tr {
            height: 32px;
          }
          .display.dataTable td, .display.dataTable th {
            padding: 0.25rem 0.5rem;
          }
        `}</style>
        <DataTable
          data={poList}
          columns={columns}
          className="display"
          dt={DataTableLib}
          options={{
            paging: true,
            pageLength: 10,
            lengthMenu: [10, 25, 50],
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

export default POList;
