export default function DashboardExternal() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Vendor</h1>
      <p className="text-gray-600">Your bids and updates are shown here.</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Open Tenders</h2>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Submitted Proposals</h2>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Awaiting Result</h2>
          <p className="text-3xl font-bold mt-2">1</p>
        </div>
      </div>

      {/* Tender List */}
      <div className="bg-white border rounded-lg p-4 shadow">
        <h2 className="text-xl font-semibold mb-3">Open Tenders</h2>

        <ul className="space-y-2 text-sm">
          <li>• Tender #004: Pengadaan Komponen Mesin</li>
          <li>• Tender #005: Pengadaan Jasa Maintenance</li>
          <li>• Tender #006: Pembelian Tools Factory</li>
        </ul>
      </div>
    </div>
  );
}
