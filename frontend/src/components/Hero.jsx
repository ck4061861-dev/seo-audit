import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

function Hero({ onStart, blocked }) {
  const [url, setUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();

  function handleStart() {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    if (blocked) {
      alert("You are blocked. Contact to sales@buimbdigital.com");
      return;
    }
    if (url.trim() && onStart) onStart(url.trim());
  }

  const navItems = [
    { path: "/", label: "Site Audit", icon: "🔍" },
    { path: "/seo", label: "SEO Check", icon: "📈" },
    { path: "/aeo", label: "AEO Analysis", icon: "🤖" },
    { path: "/geo", label: "GEO Visibility", icon: "🌍" },
    { path: "/reports", label: "Reports", icon: "📊" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  const isHome = location.pathname === "/";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile burger toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:hidden fixed top-4 left-4 z-60 p-2 rounded-lg bg-white border shadow-sm"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <span className="block w-5 h-0.5 bg-gray-800 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-800 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-800" />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="hidden fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 h-full z-30 bg-white border-r flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? "left-0 w-64 md:w-64" : "-left-64 w-64 md:w-16"}
          md:static md:left-0 hidden
        `}
      >
        <div className="w-64 md:w-auto flex flex-col h-full">
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between px-3 py-4 border-b min-h-[57px]">
            {sidebarOpen && (
              <span
                onClick={() => navigate("/")}
                className="font-bold text-gray-900 text-lg cursor-pointer whitespace-nowrap"
              >
                SeoAuditor
              </span>
            )}

            {/* ✅ PANEL ICON BUTTON */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex w-11 px-3 py-2.5 rounded-lg bg-[#c6030a] hover:bg-[#c60209] text-white transition"
              title="Toggle Sidebar"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-all duration-300 ${
                  sidebarOpen ? "rotate-0" : "rotate-180"
                }`}
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <line
                  x1="9"
                  y1="5"
                  x2="9"
                  y2="19"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-1 p-2 flex-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-red-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        <div className="p-6 md:p-10 flex-1">
          {blocked && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              ⚠️ You are blocked. Contact <a href="mailto:sales@buimbdigital.com" className="font-semibold underline">sales@buimbdigital.com</a> for support.
            </div>
          )}
          {/* HOME */}
          {isHome && (
            <>
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Grow Faster with{" "}
                  <span className="text-red-600">AI-Powered SEO. AEO. GEO</span>
                </h1>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                  Analyze your website across SEO, AEO, and GEO signals. Get
                  real insights, fix issues faster, and boost visibility across
                  search engines & AI platforms.
                </p>
              </div>

              {/* Input */}
              <div className="max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-md border mb-10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    placeholder="Enter domain or URL (e.g. yoursite.com)"
                    className="flex-1 min-w-0 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <button
                    onClick={handleStart}
                    className="bg-red-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition whitespace-nowrap"
                  >
                     Analyze
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    title: "Deep SEO Scan",
                    desc: "Identify technical SEO issues, broken links, and missing optimizations instantly.",
                  },
                  {
                    title: "AI Visibility",
                    desc: "Optimize your site for ChatGPT, Google AI, and next-gen search engines.",
                  },
                  {
                    title: "Actionable Fixes",
                    desc: "Get prioritized steps to improve ranking and drive organic traffic.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={isHome ? "mt-6" : ""}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Hero;
