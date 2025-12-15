import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register, login } from "../../../api/auth";
import { navigateByRole } from "../../../utils/navigateByRole";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validateForm(registerSchema, form);
    setErrors(validationErrors);

    const reg = await register(form);

    if (!reg.success) {
      if (reg.message === "redirect-login") {
        navigate(`${basePath}/login`, { replace: true });
        return;
      }
      setErrorMsg(reg.message);
      return;
    }

    sessionStorage.setItem(
      "tempRegister",
      JSON.stringify({
        email: form.email,
        password: form.password,
        application: form.application,
      })
    );

    const loginRes = await login({
      email: form.email,
      password: form.password,
      application: form.application,
    });

    if (!loginRes.success) {
      navigate(`${basePath}/register-otp`, { replace: true });
      return;
    }

    const role = JSON.parse(localStorage.getItem("role"));
    navigateByRole(role, navigate, appName);
  };

  const passwordRules = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    length: /.{8,}/,
  };

  const passwordStatus = {
    lowercase: passwordRules.lowercase.test(form.password),
    uppercase: passwordRules.uppercase.test(form.password),
    number: passwordRules.number.test(form.password),
    length: passwordRules.length.test(form.password),
  };

  const isPasswordValid = Object.values(passwordStatus).every(Boolean);

  const isPasswordMismatch =
    form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4">
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
              inputId="password"
              value={form.password}
              placeholder="Enter your Password"
              onChange={handleChange}
              toggleMask
              feedback
              promptLabel="Enter a password"
              weakLabel="Weak"
              mediumLabel="Medium"
              strongLabel="Strong"
              style={{ width: "100%" }}
              invalid={submitted && !!errors.password}
              className="w-full"
              inputClassName={`w-full ${
                form.password && !isPasswordValid ? "p-invalid" : ""
              }`}
              header={
                <div className="font-semibold mb-2">Password strength</div>
              }
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
                      Minimum 8 characters
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
            {isPasswordMismatch && (
              <small className="text-red-600">Password does not match</small>
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
