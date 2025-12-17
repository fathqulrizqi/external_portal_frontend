import React, { useEffect, useState, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

import { getPOSummary } from '../../utils/constants/summary';


function numberCommaRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    if (value != null && !isNaN(Number(value))) {
        td.textContent = Number(value).toLocaleString('en-US');
    } else {
        td.textContent = '';
    }
    td.className += ' htRight'; 
}

// Custom renderer untuk format Bulan
function monthShortRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    
    const monthNum = typeof value === 'string' ? parseInt(value, 10) : Number(value);
    
    if (!value || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        td.textContent = 'All';
    } else {
        const date = new Date(2000, monthNum - 1, 1);
        td.textContent = date.toLocaleString('en-US', { month: 'short' });
    }
}

const POSummary = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState('');
    const [rawRows, setRawRows] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const hotTableComponent = useRef(null); 

    useEffect(() => {
        setLoading(true);
        const monthToSend = month === '' ? undefined : Number(month);
        getPOSummary({ year: Number(year), month: monthToSend }).then(data => {
            setRawRows(data);
            setLoading(false);
        }).catch(err => {
             console.error("Failed to fetch PO Summary:", err);
             setLoading(false);
        });
    }, [year, month]);

    useEffect(() => {
        const vehicleIDs = ["2W Ni", "2W PM", "4W Ni", "4W PM"];
        const vehicleIDsNorm = vehicleIDs.map(v => v.trim().toLowerCase());
        const summaryMap = {};
        rawRows.forEach(row => {
            let month = row.month;
            let year = row.year;
            if ((!month || !year) && row.PODate) {
                const date = new Date(row.PODate);
                if (!isNaN(date.getTime())) {
                    month = date.getMonth() + 1;
                    year = date.getFullYear();
                }
            }
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
            
            const idx = vehicleIDsNorm.indexOf(vehicleIDNorm);
            if (idx !== -1) {
                const vID = vehicleIDs[idx];
                summaryMap[key][vID] += Number(row.qty) || 0;
            }
        });
        setRows(Object.values(summaryMap));
    }, [rawRows]);

    const columns = [
        { data: 'distributorName', type: 'text', title: 'Distributor' },
        { data: 'month', type: 'numeric', title: 'Month', renderer: monthShortRenderer, width: 80 }, 
        { data: 'year', type: 'numeric', title: 'Year', width: 80 },
        { data: '2W Ni', type: 'numeric', title: '2W Ni', renderer: numberCommaRenderer }, 
        { data: '2W PM', type: 'numeric', title: '2W PM', renderer: numberCommaRenderer },
        { data: '4W Ni', type: 'numeric', title: '4W Ni', renderer: numberCommaRenderer },
        { data: '4W PM', type: 'numeric', title: '4W PM', renderer: numberCommaRenderer },
    ];

    const totals = rows.reduce((acc, row) => {
        acc.total2WNi += Number(row['2W Ni']) || 0;
        acc.total2WPM += Number(row['2W PM']) || 0;
        acc.total4WNi += Number(row['4W Ni']) || 0;
        acc.total4WPM += Number(row['4W PM']) || 0;
        return {
            ...acc,
            grandTotal: acc.total2WNi + acc.total2WPM + acc.total4WNi + acc.total4WPM
        };
    }, { total2WNi: 0, total2WPM: 0, total4WNi: 0, total4WPM: 0, grandTotal: 0 });

    const handleExportData = () => {
        const hot = hotTableComponent.current.hotInstance;
        const exportPlugin = hot.getPlugin('exportFile');
        exportPlugin.exportToFile('csv', {
            filename: `po-summary-${year}-${month || 'all'}`,
            mimeType: 'text/csv',
            fileExtension: 'csv',
            columnHeaders: true,
            rowHeaders: false
        });
    };
    
    const months = [...Array(12)].map((_, i) => ({
        value: i + 1,
        name: new Date(2000, i, 1).toLocaleString('en-US', { month: 'long' })
    }));

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">PO Summary</h2>
                    <p className="text-gray-600 text-sm mt-1">Analyze purchase orders by distributor and vehicle type</p>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                    onClick={handleExportData} // Gunakan fungsi export Handsontable
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Summary</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input 
                            type="number" 
                            value={year} 
                            onChange={e => setYear(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                            placeholder="Year" 
                            min="2020" 
                            max="2100" 
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                        <select 
                            value={month} 
                            onChange={e => setMonth(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="">All Months</option>
                            {months.map(m => (
                                <option key={m.value} value={m.value}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-all duration-200"
                            onClick={() => {
                                setYear(new Date().getFullYear());
                                setMonth('');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards (Tidak berubah) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {/* ... (Cards tetap sama) ... */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">2W Nickel</p>
                            <p className="text-2xl font-bold text-gray-800">{totals.total2WNi.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">2W PM</p>
                            <p className="text-2xl font-bold text-gray-800">{totals.total2WPM.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">4W Nickel</p>
                            <p className="text-2xl font-bold text-gray-800">{totals.total4WNi.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">4W PM</p>
                            <p className="text-2xl font-bold text-gray-800">{totals.total4WPM.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Grand Total</p>
                            <p className="text-2xl font-bold text-gray-800">{totals.grandTotal.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading summary data...</span>
                </div>
            )}

            {/* Handsontable (Mengganti DataTable) */}
            {!loading && rows.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <style>{`
                      .handsontable {
                        font-family: inherit;
                        font-size: 0.875rem;
                      }
                      .handsontable thead th {
                        background-color: #f8fafc;
                        color: #475569;
                        font-weight: 600;
                        border-bottom: 1px solid #e2e8f0;
                      }
                      .handsontable tbody tr:hover td {
                        background-color: #f8fafc;
                      }
                      .handsontable td {
                        border-color: #f1f5f9;
                        padding: 0.75rem 1rem;
                      }
                      .handsontable .htRight {
                        text-align: right;
                      }
                    `}</style>
                    <div style={{ width: '100%', minHeight: 300 }}>
                        <HotTable
                            ref={hotTableComponent}
                            data={rows}
                            colHeaders={columns.map(col => col.title)}
                            columns={columns}
                            rowHeaders={true}
                            stretchH="all"
                            licenseKey="non-commercial-and-evaluation"
                            manualColumnResize={true}
                            manualRowResize={true}
                            filters={true}
                            dropdownMenu={true}
                            contextMenu={['copy', 'cut', 'filter_by_value', 'alignment']}
                            height={500}
                            className="htContainer htHandsontable"
                            readOnly={true} // Tabel ini hanya untuk display
                        />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && rows.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No summary data available</h3>
                    <p className="text-gray-600">Try adjusting the filters or check if there are POs for the selected period.</p>
                </div>
            )}
        </div>
    );
};

export default POSummary;