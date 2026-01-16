import { useRef } from "react";

const OtpVerification = () => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Enter the 6-digit OTP sent to your mobile number
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mt-6">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
            />
          ))}
        </div>

        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 hover:bg-indigo-700 transition">
          Verify OTP
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Didn’t receive OTP?{" "}
          <button className="text-indigo-600 font-medium hover:underline">
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
