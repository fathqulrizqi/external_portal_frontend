let mockMasterItems = [
  {
    id: 101,
    vehicle: 'Sedan X',
    vehicleId: 'SX-001',
    category: 'Engine',
    productName: 'Spark Plug Iridium',
    spType: 'Aftermarket',
    itemId: 'SP-IRD-001',
    isActive: true,
    price: 150000,
  },
  {
    id: 102,
    vehicle: 'Sedan X',
    vehicleId: 'SX-001',
    category: 'Fluids',
    productName: 'Engine Oil Synthetic 5W-30',
    spType: 'Genuine',
    itemId: 'EO-SYN-5W30',
    isActive: true,
    price: 450000,
  },
  {
    id: 103,
    vehicle: 'SUV Y',
    vehicleId: 'SY-002',
    category: 'Brakes',
    productName: 'Brake Pad Ceramic Front',
    spType: 'OEM',
    itemId: 'BP-CER-FR',
    isActive: false,
    price: 785500,
  },
  {
    id: 104,
    vehicle: 'Truck Z',
    vehicleId: 'TZ-003',
    category: 'Tires',
    productName: 'All Terrain Tire 16 inch',
    spType: 'Aftermarket',
    itemId: 'AT-T-16IN',
    isActive: true,
    price: 1800000,
  },
  {
    id: 105,
    vehicle: 'Hatchback A',
    vehicleId: 'HA-004',
    category: 'Suspension',
    productName: 'Shock Absorber Rear',
    spType: 'OEM',
    itemId: 'SA-REAR-STD',
    isActive: true,
    price: 525000,
  },
];

let nextId = 106;

const getMasterItems = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMasterItems;
};

const createMasterItem = async (newItem) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newId = nextId++;
  const itemWithId = { ...newItem, id: newId };
  mockMasterItems.push(itemWithId); 
  return itemWithId;
};

const updateMasterItem = async (id, updatedFields) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = mockMasterItems.findIndex(item => item.id === id);
  if (index !== -1) {
    mockMasterItems[index] = { ...mockMasterItems[index], ...updatedFields };
    return mockMasterItems[index];
  }
  throw new Error('Item not found for update');
};

const deleteMasterItem = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const initialLength = mockMasterItems.length;
  mockMasterItems = mockMasterItems.filter(item => item.id !== id);
  if (mockMasterItems.length === initialLength) {
    throw new Error('Item not found for delete');
  }
  return { success: true };
};

export { 
    getMasterItems, 
    createMasterItem, 
    updateMasterItem, 
    deleteMasterItem 
};