let mockPOData = [
    {
        uuid: 'po-1001-a',
        poNumber: 'PO/D-1001/2025',
        distributorName: 'Mega Jaya Sentosa',
        customerCode: 'C-MJS-001',
        poDate: '2025-11-20T00:00:00.000Z',
        niterraSO: 'SO-0051',
        niterraPO: 'NPO-0088',
        createdAt: '2025-11-21T09:30:00.000Z',
        updatedAt: '2025-11-21T09:30:00.000Z',
    },
    {
        uuid: 'po-1002-b',
        poNumber: 'PO/D-1002/2025',
        distributorName: 'Sentra Motor Asia',
        customerCode: 'C-SMA-002',
        poDate: '2025-11-25T00:00:00.000Z',
        niterraSO: 'SO-0052',
        niterraPO: 'NPO-0089',
        createdAt: '2025-11-26T10:15:00.000Z',
        updatedAt: '2025-11-26T10:15:00.000Z',
    },
    {
        uuid: 'po-1003-c',
        poNumber: 'PO/D-1003/2025',
        distributorName: 'Tiga Saudara Makmur',
        customerCode: 'C-TSM-003',
        poDate: '2025-12-01T00:00:00.000Z',
        niterraSO: 'SO-0053',
        niterraPO: 'NPO-0090',
        createdAt: '2025-12-02T11:00:00.000Z',
        updatedAt: '2025-12-02T11:00:00.000Z',
    },
];

export const getAllDistributorPOs = async () => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    return { 
        success: true, 
        data: mockPOData,
        message: 'Success fetching POs'
    };
};