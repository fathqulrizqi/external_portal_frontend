export default function DashboardInternal() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Internal</h1>
      <p className="text-gray-600">Welcome back, Admin. Here's today's overview.</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Total Vendor</h2>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Active Tenders</h2>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <p className="text-3xl font-bold mt-2">14</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="p-4 bg-white border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Recent Activities</h2>

        <ul className="space-y-2 text-sm">
          <li>• Vendor PT Maju Jaya submitted proposal for Tender #001</li>
          <li>• Internal review completed for Tender #003</li>
          <li>• Vendor PT Elektron approved for qualification</li>
        </ul>
      </div>
    </div>
  );
}
