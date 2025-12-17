import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { InputOtp } from "primereact/inputotp"; 
import { Button } from "primereact/button"; 
import { Divider } from "primereact/divider"; 
import { API } from "../../../api";
// import imgBackground from "../../../assets/images/cover-register.png"; // Tidak digunakan
import useOtpTimer from "../../../hooks/useOtpTimer";
import { getToken } from "../../../utils/cookies";
import { navigateByRole } from "../../../utils/navigateByRole";
import { login } from "../../../api/auth";

function RegisterOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const message = state?.msg;
  const appName = state?.appName || "public"; 
  const basePath = `/${appName}`;

  const [otp, setOtp] = useState(""); 
  const { timer, resetTimer, formatTime } = useOtpTimer(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) return setErrorMsg("OTP must be 6 digits.");

    let verifyRes;
    try {
      const token = getToken();
      const { data } = await API.post(
        "/users/OTPRegistrationVerification",
        { otp: otp },
        { headers: { Authorization: `${token}` } }
      );

      if (data.status !== "Success") {
        setErrorMsg(data.message);
        return;
      }

      console.log("Register OTP Valid!");
      verifyRes = true;

    } catch (err) {
      const errorDetail = err.response?.data?.message || "Wrong OTP or connection error.";
      setErrorMsg(errorDetail);
      return;
    }

    if (!verifyRes) return;

    try {
      const temp = JSON.parse(sessionStorage.getItem("tempRegister"));

      if (!temp) {
        alert("Session expired. Please login manually.");
        navigate(`${basePath}/login`);
        return;
      }

      const loginRes = await login({
        email: temp.email,
        password: temp.password,
        application: temp.application,
      });

      if (!loginRes.success) {
        alert("Login failed after OTP. Please login manually.");
        navigate(`${basePath}/login`);
        return;
      }

      sessionStorage.removeItem("tempRegister");

      const role = JSON.parse(localStorage.getItem("role"));

      navigateByRole(role, navigate, appName);

    } catch (error) {
      console.error(error);
      alert("Something went wrong during automatic login.");
      navigate(`${basePath}/login`);
    }
  };

  const handleResend = async () => {
    if (resending) return; 
    setResending(true);
    setErrorMsg("");

    try {
      const token = getToken();
      await API.post("/users/OTP", null, {
        headers: { Authorization: `${token}` }
      });
      resetTimer();
      setOtp("");
    } catch {
      setErrorMsg("Failed to resend OTP");
    }

    setResending(false);
  };

  return (
    <div className="py-32 bg-slate-50 flex justify-center px-4">
      {/* Struktur kartu putih terpusat, disamakan dengan LoginOtp */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-4">
        
        <h2 className="text-2xl font-bold text-center">OTP Verification</h2>
        
        {message && (
           <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-center text-sm">
             {message}
           </div>
        )}
        
        <p className="text-center text-gray-600">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        {errorMsg && (
          <p className="text-red-600 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PrimeReact InputOtp */}
          <div className="flex justify-center">
            <InputOtp
                value={otp}
                onChange={(e) => setOtp(e.value)}
                length={6}
                integerOnly
                className="otp-input"
            />
          </div>
          
          {/* Countdown / Resend */}
          <p className="text-center text-gray-700 text-sm">
            {timer > 0 ? (
              <>
                Haven't received the code? Resend in{" "}
                <b className="text-blue-600">{formatTime()}</b>
              </>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className={`font-semibold cursor-pointer ${resending ? 'text-slate-400' : 'text-blue-600 hover:underline'}`}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>

          <Button
            type="submit"
            label="Verify Account"
            icon="pi pi-check-circle"
            className="w-full"
            disabled={otp.length !== 6}
          />
        </form>

        <Divider />

        <p className="text-center text-sm">
          Return to{" "}
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

export default RegisterOtp;