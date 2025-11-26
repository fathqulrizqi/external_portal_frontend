import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth";
import imgBackground from "../../assets/images/cover-register.png";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setErrors({});

    if (form.password !== form.passwordConfirm) {
      setErrors({ passwordConfirm: "Password does not match" });
      return;
    }

    try {
      const result = await register(form);

      if (result.status !== "Success") {
        
        // Fungsi untuk membersihkan tanda kutip ganda di awal/akhir string (misalnya dari Joi)
        const cleanMessage = (msg) => msg.replace(/^"|"$/g, '').replace(/\\"/g, '"');

        if (typeof result.errors === "string") {
          const rawMsg = result.errors;
          const msg = rawMsg.toLowerCase();
          const cleanedError = cleanMessage(rawMsg);

          // Cek pesan kesalahan dan tampilkan di bawah field yang relevan
          if (msg.includes("email")) {
            setErrors({ email: cleanedError });
          } else if (msg.includes("phone")) {
            setErrors({ phone: cleanedError });
          } else if (msg.includes("password")) {
            setErrors({ password: cleanedError });
          } else {
            // Tampilkan sebagai pesan umum (errorMsg) jika tidak cocok dengan field manapun
            setErrorMsg(cleanedError);
          }

          return;
        }

        if (typeof result.errors === "object" && result.errors !== null) {
          // Jika BE mengirim objek kesalahan (misalnya { email: "Email is required" })
          // Kita bersihkan juga pesan di dalamnya
          const cleanedErrorsObject = Object.fromEntries(
              Object.entries(result.errors).map(([key, value]) => [key, cleanMessage(String(value))])
          );
          setErrors(cleanedErrorsObject);
          return;
        }
        
        // Fallback untuk kasus di mana result.errors tidak terduga
        setErrorMsg("Registration failed with an unexpected error structure.");
        return;
      }

      // Navigasi setelah sukses
      navigate("/login");
    } catch (err) {
      // PERBAIKAN: Menggunakan objek 'err' dari blok catch
      const errorMessage = err.response?.data?.errors || err.message || String(err);
      
      // Jika terjadi kesalahan jaringan atau server yang tidak terhandle
      setErrorMsg(`An error occurred: ${errorMessage}`);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <img
        src={imgBackground}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        {/* PESAN KESALAHAN UMUM */}
        {errorMsg && (
          <p className="text-red-600 text-center mb-3">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg outline-none ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your full name..."
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
             className={`w-full border px-3 py-2 rounded-lg outline-none transition
              ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}
            `}
              placeholder="email..."
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="phone number..."
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="password..."
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-lg outline-none ${
                errors.passwordConfirm ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="confirm password..."
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;