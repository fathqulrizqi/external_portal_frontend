import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../../api";   
import imgBackground from "../../../assets/images/cover-register.png";
import useOtpTimer from "../../../hooks/useOtpTimer";
import { getToken } from "../../../utils/cookies";
import { navigateByRole } from "../../../utils/navigateByRole";

function RegisterOtp() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { state } = useLocation();
  const message = state?.msg;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { timer, resetTimer, formatTime } = useOtpTimer(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);

  const handleChange = (value, i) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[i] = value;
    setOtp(updated);

    if (value && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const code = otp.join("");

  if (code.length !== 6) return setErrorMsg("OTP must be 6 digits.");

  try {
    const token = getToken();
    const { data } = await API.post(
      "/users/OTPRegistrationVerification",
      { otp: code },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.status === "Success") {
        alert("Register OTP Valid!");

      const { data: sidebarData } = await API.get("/user/sidebar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigateByRole(sidebarData.data?.roles, navigate);
    } else {
      setErrorMsg(data.message);
    }
  } catch {
    setErrorMsg("Verification failed");
  }
};

const handleResend = async () => {
  setResending(true);
  setErrorMsg("");

  try {
    await API.post("/users/OTP");
    resetTimer();
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
  } catch {
    setErrorMsg("Failed to resend OTP");
  }

  setResending(false);
};

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <img
        src={imgBackground}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center mb-3">OTP Verification</h1>
         <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-center">
          {message}
        </div>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        {errorMsg && (
          <p className="text-red-600 text-center mb-3">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* OTP Inputs */}
          <div className="flex justify-between">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-14 border rounded-lg text-center text-xl font-bold focus:ring focus:ring-blue-300 outline-none"
              />
            ))}
          </div>

          {/* Countdown */}
          <p className="text-center text-gray-700">
            {timer > 0 ? (
              <>Resend OTP in <span className="font-semibold">{formatTime()}</span></>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 font-medium hover:underline"
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Verify
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegisterOtp;
