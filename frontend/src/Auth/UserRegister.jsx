import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setError("Please fill all fields");
      return;
    }

    const phoneOnlyDigits = formData.phone.replace(/\D/g, "");
    if (phoneOnlyDigits.length !== 10) {
      setError("Phone number must contain exactly 10 digits");
      return;
    }

    if (!/^\d{10}$/.test(phoneOnlyDigits)) {
      setError("Phone number should contain digits only");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Normalize phone for backend
    formData.phone = phoneOnlyDigits;

    try {
      setLoading(true);

      const payload = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
      };

      const res = await fetch(`${API_URL}/api/auth/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // 🔥 auto login after register
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // 🔥 store token for API calls
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl grid lg:grid-cols-2 overflow-hidden">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#1c2430] to-[#111a24] text-white p-10">
          <h1 className="text-3xl xl:text-4xl font-bold mb-4">
            Join Us Today 
          </h1>

          <p className="text-gray-300 mb-6 text-sm xl:text-base">
            Create your account and unlock powerful tools to grow your digital
            presence.
          </p>

          {/* FEATURES */}
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Smart Website Analysis Tools
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Real-time Insights & Reports
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Improve Performance & SEO
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Easy Dashboard Management
            </div>
          </div>

          {/* TRUST LINE */}
          <div className="mt-8 text-xs text-gray-400 italic">
            Trusted by developers & businesses worldwide 🌍
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign Up
            </h2>
            <p className="text-gray-500 text-sm mt-1">Create your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78]"
                placeholder="Enter your name"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78]"
                placeholder="Enter your email"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78]"
                placeholder="Enter your phone number"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78]"
                placeholder="Enter your password"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2f7a78] text-white py-3 rounded-lg font-semibold hover:bg-[#256a68]"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <div className="flex-1 h-[1px] bg-gray-300" />
              OR
              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>
          </div>

          {/* SWITCH TO LOGIN */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#2f7a78] cursor-pointer font-semibold"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
