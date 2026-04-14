import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./src/components/Hero.jsx";
import LoadingScreen from "./src/components/LoadingScreen.jsx";
import ResultsPage from "./src/components/ResultsPage.jsx";

function Landingpage() {
  const [page, setPage] = useState("hero");
  const [domain, setDomain] = useState("");
  const [auditData, setAuditData] = useState(null);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditReady, setAuditReady] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState({ plan: "", used: 0, limit: 0, period: "Monthly" });

  const navigate = useNavigate();

  async function handleStart(rawUrl) {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const cleanDomain = url.replace(/https?:\/\//i, "").replace(/\/$/, "");

    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const localUser = storedUser ? JSON.parse(storedUser) : null;

    // ❌ Not logged in
    if (!accessToken || !localUser) {
      setError("Please login and buy premium to generate an audit report.");
      setPage("error");
      return;
    }

    // ❌ Blocked user
    if (localUser.blocked) {
      setError("You are blocked. Contact to sales@buimbdigital.com");
      setPage("error");
      return;
    }

    // ❌ Free limit exceeded → SHOW MODAL ONLY
    if (!localUser.premium && Number(localUser.auditsGenerated || 0) >= 1) {
      setShowLockedModal(true);
      return; // 🚀 IMPORTANT (error page remove)
    }

    setDomain(cleanDomain);
    setPage("loading");
    setError("");
    setLoadingProgress(0);
    setAuditReady(false);

    try {
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";
      const endpoint = baseUrl ? `${baseUrl}/api/audit/run` : "/api/audit/run";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setLimitInfo({
            plan: json.plan || "Premium",
            used: json.used || 0,
            limit: json.limit || 0,
            period: json.billingPeriod || "Monthly",
          });
          setShowLockedModal(true);
          return;
        }
        throw new Error(json.error || `Server error ${res.status}`);
      }

      setAuditData(json.data);
      setAuditReady(true);

      // update user audit counts
      const updatedUser = {
        ...localUser,
        auditsGenerated: Number(localUser.auditsGenerated || 0) + 1,
        auditsUsed: Number(json.auditsUsed || 0),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message || "Audit failed.");
      setPage("error");
    }
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const localUser = JSON.parse(storedUser);
      if (localUser?.blocked) {
        setIsBlocked(true);
        setError("You are blocked.");
        setPage("error");
      }
    } catch {
      setIsBlocked(false);
    }
  }, []);

  useEffect(() => {
    if (page === "loading" && auditData && loadingProgress >= 99) {
      setPage("results");
    }
  }, [page, auditData, loadingProgress]);

  function handleReset() {
    setPage("hero");
    setDomain("");
    setAuditData(null);
    setError("");
    setLoadingProgress(0);
    setAuditReady(false);
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ❌ ERROR PAGE (Modal open ho to hide) */}
      {page === "error" && !showLockedModal && (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-red-700">Action Required</h2>
            <button
              onClick={() => {
                setPage("hero");
                setError("");
              }}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {page === "hero" && <Hero onStart={handleStart} blocked={isBlocked} />}

      {page === "loading" && (
        <LoadingScreen
          domain={domain}
          onProgress={(pct) => setLoadingProgress(pct)}
        />
      )}

      {page === "results" && auditData && (
        <ResultsPage data={auditData} domain={domain} onReset={handleReset} />
      )}

      {/* ✅ LOCKED MODAL */}
      {showLockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
          <div className="w-96 animate-in fade-in zoom-in duration-200 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-2xl">
            
            {/* Visual Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#a90006]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Typography */}
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Time to Upgrade! </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed px-2">
                You've used your free audit to explore SeoAuditor. Unlock premium to get uninterrupted access.
              </p>
            </div>

            {/* Sleek Features List */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3 text-[14px] text-gray-800 font-semibold">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">✓</div>
                  Unlimited Website Audits
                </li>
                <li className="flex items-center gap-3 text-[14px] text-gray-800 font-semibold">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">✓</div>
                  Downloadable PDF Reports
                </li>
                <li className="flex items-center gap-3 text-[14px] text-gray-800 font-semibold">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">✓</div>
                  Advanced SEO & AEO Insights
                </li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 flex items-center justify-center gap-4 text-[12px] font-semibold text-gray-400">
              <div className="flex items-center gap-1.5 border-r pr-4 border-gray-200">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Secure Payment
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#a90006]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Instant Access
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLockedModal(false);
                  navigate("/pricing");
                }}
                className="w-full rounded-xl bg-[#a90006] py-3.5 text-[15px] font-bold text-white shadow-md hover:bg-[#8a0005] hover:shadow-lg transition-all active:scale-[0.98]"
              >
                View Plans & Pricing
              </button>

              <button
                onClick={() => {
                  setShowLockedModal(false);
                  setPage("hero");
                }}
                className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                No thanks, maybe later
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Landingpage;