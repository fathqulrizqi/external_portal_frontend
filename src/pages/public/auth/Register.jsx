import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register, login } from "../../../api/auth";
import { navigateByRole } from "../../../utils/navigateByRole";
import { Divider } from 'primereact/divider';

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { registerSchema } from "../../../utils/auth-schema";
import { validateForm } from "../../../utils/constants/validateForm";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const appName = location.pathname.split("/")[1] || "public";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const validationErrors = validateForm(registerSchema, updatedForm);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));
  };
  const PASSWORD_MIN = 10;

  const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;

  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
  const myPasswordValidator = (value) => {
    if (!value) return 0;

    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasLength = value.length >= 12;

    if (hasLower && hasUpper && hasNumber && hasLength) {
      return 2;
    }

    if (
      (hasLower && hasUpper) ||
      (hasLower && hasNumber) ||
      (hasUpper && hasNumber) ||
      (hasLength && hasLength)
    ) {
      return 1; // Medium
    }

    return 0; // Weak
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    

    const validationErrors = validateForm(registerSchema, form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const reg = await register(form);
    if (!reg.success) {
      if (reg.message === "redirect-login") {
        navigate(`${basePath}/login`, { replace: true });
        return;
      }
      if (reg.message === "Email already registered") {
        setErrorMsg("Email already registered. Please use a different email or sign in.");
      } else {
        setErrorMsg(reg.message);
      }
      return;
    }

    sessionStorage.setItem(
      "tempRegister",
      JSON.stringify({
        email: form.email,
        password: form.password,
        application: appName,
      })
    );

    const loginRes = await login({
      email: form.email,
      password: form.password,
      application: appName,
    });

    if (!loginRes.success) {
      navigate(`${basePath}/register-otp`, { replace: true });
      return;
    }

    const role = JSON.parse(localStorage.getItem("role"));
    navigateByRole(role, navigate, appName);
    setSubmitted(true);
  };

  const passwordRules = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    length: /.{12,}/,
  };

  const passwordStatus = {
    lowercase: /[a-z]/.test(form.password),
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    length: form.password.length >= 10,
  };

  const isPasswordMismatch =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  return (
    <div className="py-16 bg-slate-50 flex flex-col items-center justify-center px-4">
      {errorMsg && (
        <div className="mb-4 w-full max-w-5xl mx-auto display-block justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <span className="block sm:inline">{errorMsg}</span>
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Title */}
        <div className="text-center md:text-left px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Create Account
          </h2>

          <p className="text-slate-600 mt-2">Join the Distributor PO Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-fluid">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Full Name
            </label>
            <InputText
              name="fullName" // Pastikan ada name untuk handleChange
              value={form.fullName}
              placeholder="Enter your full name"
              onChange={handleChange}
              invalid={submitted && !!errors.fullName} // Gunakan prop invalid
              className="w-full"
            />
            {submitted && errors.fullName && (
              <small className="p-error text-red-600">{errors.fullName}</small>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <InputText
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="youremail@mail.com"
              invalid={submitted && !!errors.email}
              className="w-full"
            />
            {submitted && errors.email && (
              <small className="p-error text-red-600">{errors.email}</small>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Phone</label>
            <InputText
              value={form.phone}
              placeholder="0812345678"
              name="phone"
              invalid={submitted && !!errors.phone}
              onChange={handleChange}
              className={`w-full ${submitted && errors.phone ? "invalid" : ""}`}
            />
            {submitted && errors.phone && (
              <small className="p-error text-red-600">{errors.phone}</small>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Password
            </label>
            <Password
              name="password"
              value={form.password}
              onChange={handleChange}
              toggleMask
              feedback
              placeholder="Enter your Password"
              mediumRegex={mediumRegex}
              strongRegex={strongRegex}
              weakLabel="Weak"
              mediumLabel="Medium"
              strongLabel="Strong"
              invalid={submitted && !!errors.password}
              className="w-full"
              footer={
                <>
                  <p className="text-sm font-medium mb-2">
                    Password must contain:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <i
                        className={`pi ${
                          passwordStatus.lowercase
                            ? "pi-check-circle text-green-600"
                            : "pi-times-circle text-slate-400"
                        }`}
                      />
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <i
                        className={`pi ${
                          passwordStatus.uppercase
                            ? "pi-check-circle text-green-600"
                            : "pi-times-circle text-slate-400"
                        }`}
                      />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <i
                        className={`pi ${
                          passwordStatus.number
                            ? "pi-check-circle text-green-600"
                            : "pi-times-circle text-slate-400"
                        }`}
                      />
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      <i
                        className={`pi ${
                          passwordStatus.length
                            ? "pi-check-circle text-green-600"
                            : "pi-times-circle text-slate-400"
                        }`}
                      />
                      Minimum 10 characters
                    </li>
                  </ul>
                </>
              }
            />

            {errors.password && (
              <small className="p-error text-red-600">{errors.password}</small>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Confirm Password
            </label>

            <Password
              value={form.passwordConfirm}
              placeholder="Enter your confirm password"
              onChange={handleChange}
              toggleMask
              feedback={false}
              name="passwordConfirm"
              className="w-full"
              invalid={submitted && !!errors.passwordConfirm}
              inputClassName={`w-full ${isPasswordMismatch ? "p-invalid" : ""}`}
            />
            {errors.passwordConfirm && (
              <small className="p-error text-red-600">
                {errors.passwordConfirm}
              </small>
            )}
          </div>

          <Button
            type="submit"
            label="Create Account"
            icon="pi pi-user-plus"
            className="w-full"
          />
          <Divider />
          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link
              to={`${basePath}/login`}
              className="text-blue-600 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
