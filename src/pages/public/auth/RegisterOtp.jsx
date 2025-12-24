import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { InputOtp } from "primereact/inputotp";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { API } from "../../../api";
import { Message } from "primereact/message";

// import imgBackground from "../../../assets/images/cover-register.png"; // Tidak digunakan
import useOtpTimer from "../../../hooks/useOtpTimer";
import { getRole, getToken } from "../../../utils/cookies";
import { navigateByRole } from "../../../utils/navigate";
import { login, OTPRegistrationVerification } from "../../../api/auth";
import { getAppName } from "../../../utils/location";

function RegisterOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const message = state?.msg;
  const appName = getAppName();
  const basePath = `/${appName}`;
  const [otp, setOtp] = useState("");
  const { timer, resetTimer, formatTime } = useOtpTimer(120);
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (otp.length !== 6) return setErrorMsg("OTP must be 6 digits.");

  setLoading(true); // Pastikan kamu punya state [loading, setLoading]
  setErrorMsg("");

  try {
    // 1. Panggil fungsi API (jangan pakai variabel 'data' langsung di sini)
    const result = await OTPRegistrationVerification({ otp });

    // 2. Cek success dari return value fungsi tersebut
    if (!result.success) {
      setErrorMsg(result.message || "Wrong OTP or connection error.");
      setLoading(false);
      return;
    }

    console.log("Register OTP Valid!");

    // 3. Proses Login Otomatis
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

    // Handle login success atau kasus "Account is not active" (verifikasi admin)
    if (loginRes.success || loginRes.message === "Account is not active") {
  const role = getRole();
  const token = getToken();
  
  console.log("Login Sukses, Token didapat:", token);
  console.log("Role user:", role);
  
  sessionStorage.removeItem("tempRegister"); 
  
  // Pastikan navigateByRole benar-benar tereksekusi
  console.log("Mengarahkan ke dashboard...");
  navigateByRole(role, navigate, appName);
  return; // Hentikan eksekusi script di sini
}
  } catch (err) {
    // Catch ini hanya akan kena jika ada error fatal (misal JSON.parse gagal)
    setErrorMsg("An unexpected error occurred.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setErrorMsg("");

    try {
      const token = getToken();
      await API.post("/users/OTP", null, {
        headers: { Authorization: `${token}` },
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
          <Message severity="success" text={message} className="mb-4! w-full" />
        )}

        <p className="text-center text-gray-600">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}

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
                className={`font-semibold cursor-pointer ${
                  resending ? "text-slate-400" : "text-blue-600 hover:underline"
                }`}
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
