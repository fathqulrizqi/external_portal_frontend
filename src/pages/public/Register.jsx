import imgBackground from "../../assets/images/cover-register.png";
import { useActiveBreakpoint } from "../../hooks/useBreakpoints";

function InputField({ label }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm md:text-base font-semibold">{label}</label>
      <input
        type="text"
        className="
          bg-white rounded-md px-3 
          h-[32px] md:h-[38px] lg:h-[42px]
          shadow-sm
        "
      />
    </div>
  );
}

function Sidebar() {
  return (
    <div
      className="
        bg-[rgba(0,114,125,0.9)] text-white 
        flex flex-col gap-2
        p-2 md:p-2 lg:p-8
        w-full md:w-[160px] lg:w-[210px]
        rounded-md 
      "
    >
      <p className="text-yellow-300 font-bold">Profile</p>
      <p className="font-bold">Company</p>
    </div>
  );
}


export default function Register() {
  const { breakpoint } = useActiveBreakpoint();
  console.log("Breakpoint:", breakpoint);

  return (
    <div className="relative w-full min-h-screen bg-white flex items-center justify-center">
      
      {/* Background */}
      <img
        src={imgBackground}
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt="background"
      />

      {/* Overlay content */}
      <div
        className="
          relative z-10 
          w-full max-w-[900px]
          flex flex-col gap-6
          p-6 md:p-12
        "
      >
        <h1 className="text-center font-bold text-2xl md:text-3xl">Register</h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <Sidebar />

          {/* Form */}
          <div className="flex flex-col gap-6 w-full">
            <InputField label="Full Name" />
            <InputField label="Email" />
            <InputField label="Password" />
          </div>
        </div>

        <button
          className="
            bg-blue-600 text-white 
            px-4 py-2 
            rounded-md 
            w-[120px] 
            self-center
            hover:bg-blue-700 transition
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}
