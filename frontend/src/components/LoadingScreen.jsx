import React, { useEffect, useRef, useState } from "react";

const SCAN_STEPS = [
  { label: "Resolving DNS & verifying SSL certificate",  detail: "Checking HTTPS, redirect chains and domain health",           checks: 4,  duration: 3000 },
  { label: "Crawling homepage structure",               detail: "Reading meta tags, H1, canonical, Open Graph",                checks: 7,  duration: 4500 },
  { label: "Discovering internal pages",                detail: "Mapping URL structure, sitemap.xml, robots.txt",              checks: 5,  duration: 5000 },
  { label: "Auditing on-page SEO elements",             detail: "Title tags, meta descriptions, heading hierarchy, placement", checks: 9,  duration: 5500 },
  { label: "Checking technical SEO setup",              detail: "Structured data, hreflang, noindex flags, redirect loops",    checks: 9,  duration: 5000 },
  { label: "Testing Core Web Vitals",                   detail: "LCP, CLS, INP, TTFB, render-blocking resources",             checks: 8,  duration: 5500 },
  { label: "Analysing mobile & UX signals",             detail: "Viewport tag, touch targets, font size, responsiveness",     checks: 4,  duration: 4500 },
  { label: "Running AEO & schema checks",               detail: "FAQ schema, HowTo, E-E-A-T, featured snippet readiness",     checks: 20, duration: 5000 },
  { label: "Scanning GEO & AI visibility signals",      detail: "LLM-ready content, brand citability, AI crawler access",     checks: 20, duration: 5000 },
  { label: "Auditing backlink & local SEO profile",     detail: "Domain authority, NAP consistency, Google Business signals", checks: 10, duration: 4000 },
  { label: "Compiling scores & building report",        detail: "Weighting SEO×0.4, AEO×0.3, GEO×0.3 for final score",      checks: 89, duration: 4000 },
];

const TOTAL_DUR = SCAN_STEPS.reduce((a, s) => a + s.duration, 0);

export default function LoadingScreen({ domain, onProgress }) {
  const [stepStates, setStepStates] = useState(
    SCAN_STEPS.map(() => "pending") // "pending" | "active" | "done"
  );
  const [progress, setProgress] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);
  const [issues, setIssues] = useState(0);
  const [passed, setPassed] = useState(0);
  const stepIdx = useRef(0);

  useEffect(() => {
    let cancelled = false;

    function runStep(i) {
      if (i >= SCAN_STEPS.length || cancelled) return;
      setStepStates((prev) => prev.map((s, idx) => (idx === i ? "active" : s)));
      const s = SCAN_STEPS[i];
      const progStart = SCAN_STEPS.slice(0, i).reduce((a, x) => a + x.duration, 0) / TOTAL_DUR * 100;
      const progEnd   = SCAN_STEPS.slice(0, i + 1).reduce((a, x) => a + x.duration, 0) / TOTAL_DUR * 100;
      let pt = 0;
      const iv = setInterval(() => {
        pt = Math.min(pt + 80, s.duration);
        const pct = Math.round(progStart + (pt / s.duration) * (progEnd - progStart));
        setProgress(pct);
        onProgress?.(pct);
        if (pt >= s.duration) clearInterval(iv);
      }, 80);

      setTimeout(() => {
        if (cancelled) return;
        clearInterval(iv);
        setStepStates((prev) => prev.map((st, idx) => (idx === i ? "done" : st)));
        setTotalChecks((prev) => {
          const next = prev + s.checks;
          const iFound = i < SCAN_STEPS.length - 1 ? Math.floor(s.checks * (0.12 + Math.random() * 0.22)) : 0;
          setIssues((p) => p + iFound);
          setPassed(() => next - (issues + iFound));
          return next;
        });

        if (i === SCAN_STEPS.length - 1) {
          setProgress(100);
          onProgress?.(100);
          return;
        }

        runStep(i + 1);
      }, s.duration);
    }

    runStep(0);
    return () => { cancelled = true; };
  }, []);

  const base = domain.replace(/https?:\/\//i, "").replace(/\/$/, "");

  return (
    <div className="min-h-[calc(100vh-56px)] bg-white flex items-start justify-center py-12 px-6">
      <div className="w-full max-w-[560px]">
        {/* Domain pill */}
        <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3.5 py-1.5 text-sm text-gray-500 mb-7">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-blink" />
          {base}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1.5">AI audit in progress</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          AI is analysing your website across all checks — it takes approx 60 – 90 seconds.
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-7">
          <div className="flex-1 h-1 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full rounded bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 min-w-[34px] text-right">{progress}%</span>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-0 mb-7">
          {SCAN_STEPS.map((s, i) => {
            const state = stepStates[i];
            return (
              <div key={i} className="flex items-start gap-3 py-2.5 relative">
                {i < SCAN_STEPS.length - 1 && (
                  <div className="absolute left-[10px] top-6 bottom-[-10px] w-px bg-gray-100 z-0" />
                )}
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {state === "done" && (
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 11 11" fill="none">
                        <polyline points="2,5.5 4.5,8 9,3" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {state === "active" && (
                    <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-300 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 animate-spin-slow" viewBox="0 0 11 11">
                        <circle cx="5.5" cy="5.5" r="3.5" stroke="#185FA5" strokeWidth="1.5" strokeDasharray="14 8" strokeLinecap="round" fill="none"/>
                      </svg>
                    </div>
                  )}
                  {state === "pending" && (
                    <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                  )}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] font-medium leading-snug transition-colors ${state === "active" ? "text-gray-900" : state === "done" ? "text-gray-500" : "text-gray-400"}`}>
                    {s.label}
                  </div>
                  {state === "active" && (
                    <div className="text-[12px] text-gray-400 mt-0.5">{s.detail}</div>
                  )}
                  {state === "active" && (
                    <div className="h-0.5 bg-gray-100 rounded mt-1.5 overflow-hidden">
                      <div className="h-full w-[38%] bg-blue-400 rounded animate-shimmer" />
                    </div>
                  )}
                </div>
                {state === "done" && (
                  <span className="text-[11px] font-medium text-emerald-700 ml-auto whitespace-nowrap pt-0.5">
                    +{s.checks} checks
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Checks run",    val: totalChecks, cls: "text-blue-600" },
            { label: "Issues found",  val: issues > 0 ? issues : "—",  cls: "text-amber-600" },
            { label: "Passed",        val: passed > 0 ? passed : "—",  cls: "text-emerald-600" },
          ].map((c) => (
            <div key={c.label} className="bg-gray-50 rounded-lg p-3">
              <div className="text-[11px] text-gray-400 mb-1">{c.label}</div>
              <div className={`text-xl font-semibold tabular-nums ${c.cls}`}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
