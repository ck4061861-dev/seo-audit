import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // only for refresh cookie
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ store user info only (for UI state)
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // 🔥 store token for API calls
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      // 🔥 force UI refresh (navbar update)
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
          <h1 className="text-3xl xl:text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-gray-300 mb-8 text-sm xl:text-base">
            Sign in to access your dashboard and features.
          </p>
          {/* FEATURES */}
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Secure & Fast Authentication
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Access your personalized dashboard
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              Track your activity & data easily
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-400">✔</span>
              24/7 support available
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sign In
            </h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none"
                placeholder="Enter your email"
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
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f7a78] outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* OPTIONS */}
            <div className="flex flex-wrap justify-between items-center text-sm gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#2f7a78] cursor-pointer hover:underline font-medium"
              >
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2f7a78] text-white py-3 rounded-lg font-semibold hover:bg-[#256a68] transition"
            >
              {loading ? "Signing In..." : " Sign In"}
            </button>
          </form>

          {/* SOCIAL */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <div className="flex-1 h-[1px] bg-gray-300" />
              OR
              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#2f7a78] font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
