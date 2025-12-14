import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register } from "../../../api/auth";
import { login } from "../../../api/auth";
import { navigateByRole } from "../../../utils/navigateByRole";
import { Input, Button, Field, Label, Fieldset } from "@headlessui/react";
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

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

    // === SAVE TEMP REGISTER DATA FOR OTP PAGE ===
    sessionStorage.setItem(
      "tempRegister",
      JSON.stringify({
        email: form.email,
        password: form.password,
        application: form.application,
      })
    );

    // === TRY AUTO LOGIN (backend will force OTP if not active) ===
    const loginRes = await login({
      email: form.email,
      password: form.password,
      application: form.application,
    });

    if (!loginRes.success) {
      if (loginRes.message === "redirect-register-otp") {
        alert("Account is not active!");
        navigate(`${basePath}/register-otp`, { replace: true });
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

  const isPasswordMatch =
  form.passwordConfirm.length > 0 &&
  form.password !== form.passwordConfirm;

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-16 flex items-center justify-center px-4">
      {/* Background that blends with navbar */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,30,58,0.06)_0%,_rgba(11,30,58,0.02)_180px,_transparent_181px)]" />
        <div className="absolute inset-0 bg-slate-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-600 mt-1">Join the Distributor PO Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          {/* General Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Fieldset className="space-y-5">
              {/* Full Name */}
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-slate-900 placeholder:text-slate-400 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-slate-300 focus:ring-blue-600 focus:border-transparent"
                  }`}
                  placeholder="John Doe"
                  required
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-slate-900 placeholder:text-slate-400 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-slate-300 focus:ring-blue-600 focus:border-transparent"
                  }`}
                  placeholder="you@company.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </Field>

              {/* Phone */}
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-slate-900 placeholder:text-slate-400 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-slate-300 focus:ring-blue-600 focus:border-transparent"
                  }`}
                  placeholder="+62 812 3456 7890"
                  required
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </Field>

              {/* Password */}
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Password
                </Label>

                <Password
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  toggleMask
                  feedback
                  header={<div className="font-bold mb-3">Pick a password</div>}
                  footer={
                    <>
                      <Divider />
                      <p className="mt-2 text-sm">Suggestions</p>
                      <ul className="mt-3 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <i
                            className={`pi ${
                              passwordStatus.lowercase ? "pi-check-circle text-green-600" : "pi-times-circle text-slate-400"
                            }`}
                          />
                          At least one lowercase
                        </li>

                        <li className="flex items-center gap-2">
                          <i
                            className={`pi ${
                              passwordStatus.uppercase ? "pi-check-circle text-green-600" : "pi-times-circle text-slate-400"
                            }`}
                          />
                          At least one uppercase
                        </li>

                        <li className="flex items-center gap-2">
                          <i
                            className={`pi ${
                              passwordStatus.number ? "pi-check-circle text-green-600" : "pi-times-circle text-slate-400"
                            }`}
                          />
                          At least one numeric
                        </li>

                        <li className="flex items-center gap-2">
                          <i
                            className={`pi ${
                              passwordStatus.length ? "pi-check-circle text-green-600" : "pi-times-circle text-slate-400"
                            }`}
                          />
                          Minimum 8 characters
                        </li>
                      </ul>

                    </>
                  }
                  className="w-full"
                  inputClassName={`w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                />

                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </Field>


              {/* Confirm Password */}
              <Field>
                <Label className="block text-sm font-medium text-slate-800 mb-2">
                  Confirm Password
                </Label>

                <Password
                  value={form.passwordConfirm}
                  onChange={(e) =>
                    setForm({ ...form, passwordConfirm: e.target.value })
                  }
                  toggleMask
                  feedback={false}
                  className="w-full"
                  inputClassName={`w-full px-4 py-3 rounded-lg border ${
                    errors.passwordConfirm
                      ? "border-red-500 bg-red-50"
                      : "border-slate-300"
                  }`}
                />
                {isPasswordMatch && (
                  <p className="text-red-600 text-sm mt-1">
                    Password does not match
                  </p>
                )}

                {errors.passwordConfirm && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </Field>


              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Create Account
              </Button>
            </Fieldset>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to={`${basePath}/login`}
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
