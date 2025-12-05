import { useState } from "react";
import { Link } from "react-router-dom";
import imgBackground from "../../../assets/images/cover-register.png";
import { resetPassword } from "../../../api/auth";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    const result = await resetPassword(email);
    
      if (!result.success) {
        if (result.message === "error-alert") {
          alert("Server Error!")
          return;
        } 
       
        setErrorMsg(result.message);
        return;
      }
    

    setMessage("Email sent. Check your email to reset your password.");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background Image */}
      <img
        src={imgBackground}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Reset Password Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        {message && (
          <p className="text-blue-600 text-center mb-3">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Your email..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Back to{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
