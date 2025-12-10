export function RegisterButton() {
  return (
    <a
      href="/register"
      className="bg-[#00727d] px-[8px] py-[4px] flex items-center justify-center shrink-0"
    >
      <p className="font-almarai font-bold text-[14px] tracking-[1.54px] text-white">
        Register
      </p>
    </a>
  );
}

export function LoginButton() {
  return (
    <a
      href="/login"
      className="font-almarai font-bold text-[14px] tracking-[1.54px] text-black"
    >
        Login
    </a>
  );
}

export function Divider() {
  return <div className="bg-[#f9b000] h-[22px] w-px shrink-0" />;
}
