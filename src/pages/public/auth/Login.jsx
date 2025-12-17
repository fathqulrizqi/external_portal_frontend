import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../api/auth";
import { navigateByRole } from "../../../utils/navigateByRole";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";

import { loginSchema } from "../../../utils/auth-schema";
import { validateForm } from "../../../utils/constants/validateForm";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const appName = location.pathname.split("/")[1] || "public";
  const basePath = `/${appName}`;

  const [form, setForm] = useState({
    email: "",
    password: "",
    application: appName,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const validationErrors = validateForm(loginSchema, updatedForm);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMsg("");
    const { email, password } = form;
    const validationErrors = validateForm(loginSchema, { email, password });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const result = await login(form);

    if (!result.success) {
      setErrorMsg("Invalid email or password");
      return;
    }

    const role = JSON.parse(localStorage.getItem("role"));
    navigateByRole(role, navigate, appName);
  };

  return (
  <div className="py-32 bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Title */}
        <div className="text-center md:text-left px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Login
          </h2>

          <p className="text-slate-600 mt-2">Login into Distributor PO Portal</p>
        </div>

        {errorMsg && (
          <Message severity="error" text={errorMsg} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 p-fluid">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <InputText
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="youremail@mail.com"
              className="w-full"
              invalid={submitted && !!errors.email}
            />
            {submitted && errors.email && (
              <small className="p-error">{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Password
            </label>
            <Password
              name="password"
              value={form.password}
              onChange={handleChange}
              toggleMask
              feedback={false}
              placeholder="Enter your password"
              className="w-full"
              inputClassName="w-full"
              invalid={submitted && !!errors.password}
            />
            {submitted && errors.password && (
              <small className="p-error">{errors.password}</small>
            )}
          </div>

          <div className="flex justify-start">
            <Link
              to={`${basePath}/reset-password`}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            label="Sign In"
            icon="pi pi-sign-in"
            className="w-full"
          />
          <Divider />

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to={`${basePath}/register`}
            className="text-blue-600 font-semibold"
          >
            Create Account
          </Link>
        </p>
        </form>

       
      </div>
    </div>
  );
}

export default Login;
