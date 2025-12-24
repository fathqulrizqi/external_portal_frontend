import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../api/profile/index";
import UserAvatar from "../../../components/ui/User-Initial";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");

  const labelClass = "block text-xs font-medium text-gray-500 mb-1";
  const asterisk = <span className="text-red-500">*</span>;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
  setLoading(true);
  const res = await getProfile();

  if (res.success) {
    setProfile(res.data);
    setForm(res.data);
  } else {
    // Tambahkan Logika Handle Session Expired
    if (res.message === "Session Expired!!") {
      // Kamu bisa arahkan ke login atau login-otp sesuai alur aplikasi
      navigate(`${basePath}/login-otp`, { 
        replace: true, 
        state: { msg: "Sesi Anda telah berakhir, silakan verifikasi ulang." } 
      });
      return; // Stop eksekusi agar tidak set error message di UI dashboard
    }
    
    setError(res.message);
  }
  setLoading(false);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        dataToSend.append(key, value);
      }
    });

    try {
      const res = await updateProfile(dataToSend);
      if (res.success) {
        setProfile(res.data);
        setIsEdit(false);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500 p-6 text-center">Loading...</p>;
  if (error) return <p className="text-red-500 p-6 text-center">{error}</p>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mt-10">
      {!isEdit ? (
        /* VIEW MODE */
        <>
          <div className="flex flex-col items-center">
            <UserAvatar name={profile.fullName} size={20} fontSize={30} />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">{profile.fullName}</h2>
            <p className="text-sm text-gray-500">{profile.phone}</p>
          </div>
          <Divider />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User ID</span>
              <span className="text-gray-800 font-mono">{profile.userId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Created At</span>
              <span className="text-gray-800">{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Divider />

          <Button
            label="Edit Profile"
            icon="pi pi-pencil"
            className="p-button-sm w-full mt-6"
            onClick={() => setIsEdit(true)}
          />
        </>
      ) : (
        /* EDIT MODE */
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Edit Information</h3>
            <div className="flex justify-center">
              <UserAvatar name={profile.fullName} size={20} fontSize={30} />
            </div>
            <div>
              <label className={labelClass}>Full Name {asterisk}</label>
              <InputText
                name="fullName"
                value={form.fullName || ""}
                onChange={handleInputChange}
                className="w-full p-inputtext-sm"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Phone {asterisk}</label>
              <InputText
                name="phone"
                keyfilter="int"
                value={form.phone || ""}
                onChange={handleInputChange}
                className="w-full p-inputtext-sm"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                label={loading ? "Saving..." : "Save"}
                icon="pi pi-check"
                className="p-button-sm p-button-success flex-1"
                loading={loading}
              />
              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                className="p-button-sm p-button-secondary p-button-text"
                onClick={() => {
                  setIsEdit(false);
                  setForm(profile);
                }}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}