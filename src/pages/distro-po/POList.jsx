import React, { useEffect, useState, useMemo } from 'react';
import { getAllDistributorPOs } from '../../api/distro-po/distro-po';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';

const POList = () => {
  const [poList, setPOList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    async function fetchPOs() {
      setLoading(true);
      const result = await getAllDistributorPOs();
      if (result.success) {
        setPOList(result.data);
        setError('');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
    fetchPOs();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'poNumber',
        header: 'PO Number',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'distributorName',
        header: 'Distributor',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'customerCode',
        header: 'Customer Code',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'poDate',
        header: 'Date',
        cell: info => info.getValue()?.slice(0, 10),
        filterFn: 'includesString',
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By',
        filterFn: 'includesString',
      },
      {
        accessorKey: 'approvedBy',
        header: 'Approved By',
        filterFn: 'includesString',
      },
    ],
    []
  );

  const table = useReactTable({
    data: poList,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Saved Distributor POs</h2>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}
      <table className="w-full border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border px-2 py-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanFilter() ? (
                    <div>
                      <input
                        type="text"
                        value={
                          (table.getState().columnFilters.find(f => f.id === header.column.id)?.value) || ''
                        }
                        onChange={e =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder={`Filter...`}
                        className="mt-1 p-1 border rounded w-full"
                      />
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border px-2 py-1">
                  {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default POList;
