
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMasterItemPriceHeaders } from "../../api/distro-po/masteritem-price-header";

export default function MasterItemPricePage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLists() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllMasterItemPriceHeaders();
        setLists(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch price lists");
        setLists([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLists();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Submitted Price Lists</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        onClick={() => navigate("/distro-po/dashboard/submitted-price-list")}
      >
        Add New Price List
      </button>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="min-w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Created By</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <tr key={list.id}>
              <td className="border px-4 py-2">{list.id}</td> {/* uuid string */}
              <td className="border px-4 py-2">{list.description}</td>
              <td className="border px-4 py-2">{list.createdBy}</td>
              <td className="border px-4 py-2">{new Date(list.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/distro-po/dashboard/submitted-price-list?id=${list.id}`)} // id is uuid string
                >
                  View/Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


