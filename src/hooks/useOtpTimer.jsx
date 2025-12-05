import { useEffect, useState } from "react";

export default function useOtpTimer(duration = 120) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const savedExpire = localStorage.getItem("otp-expire");

    if (savedExpire) {
      const diff = Math.floor((savedExpire - Date.now()) / 1000);
      setTimer(diff > 0 ? diff : 0);
    } else {
      const expireTime = Date.now() + duration * 1000;
      localStorage.setItem("otp-expire", expireTime);
      setTimer(duration);
    }
  }, [duration]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const resetTimer = () => {
    const newExpire = Date.now() + duration * 1000;
    localStorage.setItem("otp-expire", newExpire);
    setTimer(duration);
  };

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return { timer, resetTimer, formatTime };
}
