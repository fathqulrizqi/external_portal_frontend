import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgBackground from "../../../assets/images/cover-register.png";
import { resetPasswordConfirmation } from "../../../api/auth";

function ResetPasswordConfirmation() {
  const [data, setData] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { password, passwordConfirm } = data;

    if (!password) {
      setMessage("Password is required.");
      return;
    }
    if (!passwordConfirm) {
      setMessage("Password confirmation is required.");
      return;
    }
    if (password !== passwordConfirm) {
      setMessage("Password confirmation does not match.");
      return;
    }

    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const result = await resetPasswordConfirmation(
      password,
      passwordConfirm,
      token
    );

    if (!result.success) {
      if (result.message === "error-alert") {
        alert("Server Error!");
        return;
      }

      setMessage(result.message);
      return;
    }

    alert("Password changed successfully. Please login.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <img
        src={imgBackground}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        {message && (
          <p className="text-red-600 text-center mb-3">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              className="w-full border px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter new password..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={data.passwordConfirm}
              onChange={(e) =>
                setData({ ...data, passwordConfirm: e.target.value })
              }
              className="w-full border px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Confirm your new password..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordConfirmation;
