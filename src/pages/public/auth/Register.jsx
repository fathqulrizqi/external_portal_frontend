import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register } from "../../../api/auth";
import imgBackground from "../../../assets/images/cover-register.png";
import { login } from "../../../api/auth";
import { navigateByRole } from "../../../utils/navigateByRole";

function Register() {
  const navigate = useNavigate();

  const segment = location.pathname.split("/")[1]; 
  const appName = segment || "public";
  const basePath = `/${appName}`;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    application: appName,
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

  const result = await register(form);

  if (!result.success) {
    if (result.message === "redirect-login") {
      alert("Already registered!");
      navigate(`${basePath}/login`, { replace: true });
      return;
    }

    setErrorMsg(result.message);
    return;
  }

  // === REGISTER SUCCESS → AUTO-LOGIN ===
  const loginRes = await login({
    email: form.email,
    password: form.password,
  });

  if (!loginRes.success) {
    if (loginRes.message === "redirect-register-otp") {
      alert("Account is not active!");
      navigate(`${basePath}/register/otp`, { replace: true });
      return;
    }

    if (loginRes.message === "redirect-login") {
      alert("Invalid credentials!");
      navigate(`${basePath}/login`, { replace: true });

      return;
    }

    setErrorMsg(loginRes.message);
    return;
  }

  // === LOGIN SUCCESS ===
  const role = JSON.parse(localStorage.getItem("role"));
  navigateByRole(role, navigate);
};


// bisa buat helper
const handleLoginAfterRegister = async (form) => {
  const result = await login(form); 

  if (!result.success) {
    if (result.message === "redirect-register") {
      alert("Unauthorize!");
      navigate("/register", { replace: true });
      return;
    }
    if (result.message === "redirect-register-otp") {
      alert("Account is not active!");
      navigate("/register/otp", { replace: true });
      return;
    }
    
    setErrorMsg(result.message);
    return;
  }

  // login sukses
  navigate("/admin/internal");
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

            {/* Role ID (hidden) */}
            <input type="hidden" name="roleId" value={form.roleId} />

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
          Already have an account?{" "}
          <Link to={`${basePath}/login`} className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;