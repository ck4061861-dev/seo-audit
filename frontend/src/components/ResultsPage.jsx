import React, { useState, useRef, useCallback } from "react";
import OverviewPanel from "./OverviewPanel.jsx";
import ModulePanel from "./ModulePanel.jsx";
import ActionPlanPanel from "./ActionPlanPanel.jsx";
import StrategyPanel from "./StrategyPanel.jsx";
import CompetitorsPanel from "./CompetitorsPanel.jsx";
import KeywordsPanel from "./KeywordsPanel.jsx";
import { setPdfData, exportPDF } from "../utils/pdfExport.js";

const TABS = [
  { key: "overview",     label: "Overview" },
  { key: "seo",          label: "SEO Analysis" },
  { key: "aeo",          label: "AEO Analysis" },
  { key: "geo",          label: "GEO Analysis" },
  { key: "action",       label: "Action Plan" },
  { key: "strategy",     label: "SEO Strategy" },
  { key: "competitors",  label: "Competitors" },
  { key: "keywords",     label: "Keywords" },
];

function issueCount(data, key) {
  if (!["seo", "aeo", "geo"].includes(key)) return 0;
  return data.mods[key].categories.flatMap((c) => c.checks).filter((c) => c.status !== "PASS").length;
}

export default function ResultsPage({ data, domain, onReset }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfState, setPdfState] = useState({ loading: false, msg: "", pct: 0 });
  const panelRefs = useRef({});

  const setRef = useCallback((key) => (el) => {
    panelRefs.current[key] = el;
  }, []);

  async function handleExportPDF() {
    setPdfData(data, domain);
    setPdfState({ loading: true, msg: "Preparing...", pct: 0 });
    try {
      await exportPDF(panelRefs.current, (msg, pct) => {
        setPdfState({ loading: true, msg, pct });
      });
    } catch (e) {
      alert("PDF export failed: " + e.message);
    } finally {
      setPdfState({ loading: false, msg: "", pct: 0 });
    }
  }

  const auditDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="w-full xl:w-[95%] 2xl:w-[85%] mx-auto px-4 sm:px-6 lg:px-10 pb-16 pt-5">
      {/* PDF overlay */}
      {pdfState.loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-9 min-w-[380px] text-center shadow-2xl">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Generating Full PDF Report</h3>
            <p className="text-sm text-gray-500 mb-5">{pdfState.msg}</p>
            <div className="bg-gray-100 rounded-lg h-3 overflow-hidden mb-2">
              <div
                className="h-full rounded-lg transition-all duration-500"
                style={{ width: `${pdfState.pct}%`, background: "linear-gradient(90deg,#ff642d,#f59e0b)" }}
              />
            </div>
            <div className="text-sm font-bold text-brand-light">{pdfState.pct}%</div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
        <button onClick={onReset} className="text-brand hover:underline">← New Audit</button>
        <span className="text-gray-300">/</span>
        <span>{domain}</span>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-xl font-bold text-gray-900">{domain}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Audit completed · {auditDate} · 89 checks · SEO + AEO + GEO
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onReset}
            className="text-[13px] px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            New Audit
          </button>
          <button
            onClick={handleExportPDF}
            disabled={pdfState.loading}
            className="text-[13px] px-4 py-1.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const count = issueCount(data, tab.key);
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-[3px] -mb-0.5 transition-all ${
                active
                  ? "text-brand-light border-brand-light font-semibold"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[11px] px-1.5 py-0 rounded-full font-semibold ${active ? "bg-orange-100 text-brand-light" : "bg-gray-100 text-gray-500"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Panels — ALL rendered but only active one visible (so refs work for PDF) */}
      {TABS.map((tab) => (
        <div
          key={tab.key}
          ref={setRef(tab.key)}
          className={activeTab === tab.key ? "block" : "hidden"}
        >
          {tab.key === "overview" && <OverviewPanel data={data} domain={domain} />}
          {tab.key === "seo" && <ModulePanel mod={data.mods.seo} sectionNum="2" />}
          {tab.key === "aeo" && <ModulePanel mod={data.mods.aeo} sectionNum="3" />}
          {tab.key === "geo" && <ModulePanel mod={data.mods.geo} sectionNum="4" />}
          {tab.key === "action" && <ActionPlanPanel data={data} domain={domain} />}
          {tab.key === "strategy" && <StrategyPanel data={data} domain={domain} />}
          {tab.key === "competitors" && <CompetitorsPanel data={data} domain={domain} />}
          {tab.key === "keywords" && <KeywordsPanel data={data} domain={domain} />}
        </div>
      ))}
    </div>
  );
}
