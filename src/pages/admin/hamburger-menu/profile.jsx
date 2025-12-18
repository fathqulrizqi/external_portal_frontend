import { useEffect, useState } from "react";
import { getProfile } from "../../api/profile";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    const res = await getProfile();

    if (res.success) {
      setProfile(res.data);
    } else {
      setError(res.message);
    }

    setLoading(false);
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex flex-col items-center">
        <img
          src={profile.urlImage}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />

        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {profile.fullName}
        </h2>

        <p className="text-sm text-gray-500">{profile.phone}</p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">User ID</span>
          <span className="text-gray-800">{profile.userId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Created At</span>
          <span className="text-gray-800">
            {new Date(profile.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Updated At</span>
          <span className="text-gray-800">
            {new Date(profile.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
