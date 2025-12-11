import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../api/auth";
import imgBackground from "../../../assets/images/cover-register.png";
import Swal from "sweetalert2";
import { setRole } from "../../../utils/cookies";
import { navigateByRole } from "../../../utils/navigateByRole";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const segment = location.pathname.split("/")[1]; 
  const appName = segment || "public";
  const basePath = `/${appName}`;

  const [form, setForm] = useState({
    email: "",
    password: "",
    application: appName,
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

  const result = await login(form);

  if (!result.success) {
    if (result.message === "redirect-login") {
      alert("Invalid Email or Password!")
      navigate(`${basePath}/login`, { replace: true });
      return;
    } 
    if (result.message === "redirect-register") {
      alert("Invalid email. Check your email. If you don't have account, please register!")
      return;
    }
    setErrorMsg(result.message);
    return;
  }

  const role = JSON.parse(localStorage.getItem("role")); 
  navigateByRole(role, navigate, appName);
  // Force reload to ensure token is available for all requests
  window.location.reload();
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
              className="w-full border px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Your Email ..."
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
              className="w-full border px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Your Password ..."
              required
            />
          </div>
          <Link to="/reset-password" className="text-blue-600 mb-2 hover:underline">
          Forgot Password? 
          </Link>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have any account?{" "}
          <Link to={`${basePath}/register`} className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
