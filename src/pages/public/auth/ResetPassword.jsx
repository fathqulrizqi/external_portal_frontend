import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";

import { resetPassword } from "../../../api/auth";
import { resetPasswordSchema } from "../../../utils/auth-schema";
import { validateForm } from "../../../utils/constants/validateForm";

function ResetPassword() {
  const location = useLocation();

  const appName = location.pathname.split("/")[1] || "public";
  const basePath = `/${appName}`;

  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const handleChange = (e) => {
    const updated = { email: e.target.value };
    setForm(updated);
    setErrors(validateForm(resetPasswordSchema, updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerMsg("");

    const validationErrors = validateForm(resetPasswordSchema, form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const result = await resetPassword(form.email, appName);

    if (!result.success) {
      setServerMsg(
        result.message === "error-alert"
          ? "Server error. Please try again later."
          : result.message
      );
      return;
    }

    setServerMsg("Email sent. Please check your inbox.");
  };

  return (
    <div className="py-32 bg-slate-50 flex justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        {serverMsg && (
          <Message severity="info" text={serverMsg} className="w-full" />
        )}

        <form onSubmit={handleSubmit} className="space-y-3 p-fluid">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <InputText
              value={form.email}
              onChange={handleChange}
              placeholder="youremail@mail.com"
              invalid={submitted && !!errors.email}
            />
            {submitted && errors.email && (
              <small className="p-error">{errors.email}</small>
            )}
          </div>

          <Button
            type="submit"
            label="Send Reset Link"
            icon="pi pi-envelope"
            className="w-full"
          />
        </form>

        <Divider />

        <p className="text-center text-sm">
          Back to{" "}
          <Link
            to={`${basePath}/login`}
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
