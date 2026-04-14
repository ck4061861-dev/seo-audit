import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState("email"); // email, otp, password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ─────────────────────────────────────────
  // Step 1: Request OTP
  // ─────────────────────────────────────────
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(data.message);
      setTimeout(() => {
        setStep("otp");
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Step 2 & 3: OTP validated, set password
  // ─────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#2f7a78] to-[#1c2430] text-white p-8 text-center">
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-gray-200 mt-2 text-sm">
            No worries, we'll help you reset it!
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded mb-5 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-300 text-green-600 px-4 py-2 rounded mb-5 text-sm">
              {success}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2f7a78] to-[#1c2430] text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#2f7a78] font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* STEP 2 & 3: OTP + NEW PASSWORD */}
          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  OTP (Check your email)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2f7a78] to-[#1c2430] text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-[#2f7a78] py-2 rounded-lg font-medium border border-[#2f7a78] hover:bg-gray-50"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
