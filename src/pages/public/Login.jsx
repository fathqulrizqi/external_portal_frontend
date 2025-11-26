import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import imgBackground from "../../assets/images/cover-register.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(form);

      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }

      navigate("/admin/internal");
    } catch {
      setErrorMsg("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">

      {/* Background Image */}
      <img
        src={imgBackground}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {errorMsg && (
          <p className="text-red-600 text-center mb-3">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="email kamu..."
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="password..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
