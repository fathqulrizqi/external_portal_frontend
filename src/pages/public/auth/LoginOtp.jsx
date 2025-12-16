import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button"; 
import { Divider } from "primereact/divider"; 
import { API } from "../../../api";
import imgBackground from "../../../assets/images/cover-register.png";
import useOtpTimer from "../../../hooks/useOtpTimer";
import { navigateByRole } from "../../../utils/navigateByRole";
import { getToken } from "../../../utils/cookies";

function LoginOtp() {
  const navigate = useNavigate();
  const location = useLocation(); // Gunakan useLocation

  const segment = location.pathname.split("/")[1];
  const appName = segment || "public";
  const basePath = `/${appName}`; // Tambahkan basePath untuk link kembali

  const [otp, setOtp] = useState("");
  const { timer, resetTimer, formatTime } = useOtpTimer(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return setErrorMsg("OTP must be 6 digits.");
    }

    try {
      // NOTE: token is fetched from cookie (getToken())
      const token = getToken();

      const { data } = await API.post(
        "/users/OTPVerification",
        { otp },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data.status !== "Success") {
        return setErrorMsg(data.message);
      }

      // NOTE: role is fetched from localStorage.getItem("role")
      const role = JSON.parse(localStorage.getItem("role"));
      navigateByRole(role, navigate, appName);

    } catch (err) {
      console.error(err);
      setErrorMsg("Verification failed");
    }
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);
    setErrorMsg("");

    try {
      const token = getToken();
      await API.post("/users/OTP", null, {
        headers: {
          Authorization: token,
        },
      });
      resetTimer();
      setOtp("");
    } catch {
      setErrorMsg("Failed to resend OTP. Please try logging in again.");
    }

    setResending(false);
  };

  return (
    <div className="py-32 bg-slate-50 flex justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-4">
        
        <h2 className="text-2xl font-bold text-center">OTP Verification</h2>
        
        <p className="text-center text-gray-600">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        {errorMsg && (
          <p className="text-red-600 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PrimeReact OTP */}
          <div className="flex justify-center">
            <InputOtp
              value={otp}
              onChange={(e) => setOtp(e.value)}
              length={6}
              integerOnly
              className="otp-input"
            />
          </div>

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

export default LoginOtp;