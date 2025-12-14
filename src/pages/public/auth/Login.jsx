import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../api/auth";
import Swal from "sweetalert2";
import { setRole } from "../../../utils/cookies";
import { navigateByRole } from "../../../utils/navigateByRole";
import { Input, Button, Field, Label, Fieldset } from "@headlessui/react";

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
        alert("Invalid Email or Password!");
        navigate(`${basePath}/login`, { replace: true });
        return;
      }
      if (result.message === "redirect-register") {
        alert(
          "Invalid email. Check your email. If you don't have account, please register!"
        );
        return;
      }
      setErrorMsg(result.message);
      return;
    }
    const role = JSON.parse(localStorage.getItem("role"));
    navigateByRole(role, navigate, appName);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-16 flex items-center justify-center px-4">
      {/* Background that blends with a typical blue navbar */}
      {/* If your navbar is e.g. bg-[#0b1e3a], this gradient softly transitions from that tone */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,30,58,0.06)_0%,_rgba(11,30,58,0.02)_180px,_transparent_181px)]" />
        <div className="absolute inset-0 bg-slate-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">
            Login
          </h1>
          <p className="text-slate-600 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Fieldset className="space-y-6">
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 text-slate-900 placeholder:text-slate-400"
                  placeholder="you@company.com"
                  required
                />
              </Field>

              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your password"
                  required
                />
              </Field>

              <div className="flex items-center justify-between">
                <Link
                  to="/reset-password"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline transition"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Sign In
              </Button>
            </Fieldset>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to={`${basePath}/register`}
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
