// Dummy data untuk mensimulasikan respons API getPOSummary
const DUMMY_RAW_PO_ROWS = [
    // Data untuk Distributor 1
    { distributorName: 'Distributor A', vehicleID: '2W Ni', qty: 1500, PODate: '2025-01-15T00:00:00Z', month: 1, year: 2025 },
    { distributorName: 'Distributor A', vehicleID: '4W Ni', qty: 800, PODate: '2025-01-20T00:00:00Z', month: 1, year: 2025 },
    { distributorName: 'Distributor A', vehicleID: '2W PM', qty: 2200, PODate: '2025-02-10T00:00:00Z', month: 2, year: 2025 },
    { distributorName: 'Distributor A', vehicleID: '4W PM', qty: 1100, PODate: '2025-02-25T00:00:00Z', month: 2, year: 2025 },
    
    // Data untuk Distributor 2
    { distributorName: 'Distributor B', vehicleID: '2W Ni', qty: 3000, PODate: '2025-01-05T00:00:00Z', month: 1, year: 2025 },
    { distributorName: 'Distributor B', vehicleID: '4W PM', qty: 1500, PODate: '2025-01-28T00:00:00Z', month: 1, year: 2025 },
    { distributorName: 'Distributor B', vehicleID: '2W Ni', qty: 1000, PODate: '2025-02-15T00:00:00Z', month: 2, year: 2025 },
    { distributorName: 'Distributor B', vehicleID: '4W Ni', qty: 500, PODate: '2025-02-20T00:00:00Z', month: 2, year: 2025 },

    // Data 4W PM yang tidak dinormalisasi
    { distributorName: 'Distributor C', vehicleID: '4W PM ', qty: 900, PODate: '2025-03-01T00:00:00Z', month: 3, year: 2025 },
    // Data dengan vehicleID yang berbeda case
    { distributorName: 'Distributor C', vehicleID: '2w ni', qty: 2500, PODate: '2025-03-15T00:00:00Z', month: 3, year: 2025 },
];

export const getPOSummary = async ({ year, month }) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    let filteredData = DUMMY_RAW_PO_ROWS;

    if (year) {
        filteredData = filteredData.filter(row => row.year === Number(year));
    }
    if (month) {
        filteredData = filteredData.filter(row => row.month === Number(month));
    }
    
    return filteredData;
};