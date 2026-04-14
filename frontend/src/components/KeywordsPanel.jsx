import React from "react";
import { SectionHeader, DiffChip, PriorityChip } from "../utils/helpers.jsx";

function KwTable({ title, desc, kwList }) {
  if (!kwList?.length) return null;
  return (
    <div className="mb-6">
      <div className="text-sm font-bold text-gray-900 mb-1.5 mt-5">{title}</div>
      {desc && <div className="text-[12px] text-gray-500 mb-3 leading-snug">{desc}</div>}
      <div className="table-scroll">
        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minWidth: 580 }}>
          <thead>
            <tr className="bg-brand">
              {["Keyword", "Vol/mo", "Difficulty", "Intent", "Priority", "Target Page"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-white px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kwList.map((kw, i) => (
              <tr key={i} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-3 py-2.5 text-[12px] font-medium text-gray-900 min-w-[160px]">{kw.kw}</td>
                <td className="px-3 py-2.5 text-[12px] text-gray-500 text-right whitespace-nowrap">{kw.vol}</td>
                <td className="px-3 py-2.5 whitespace-nowrap"><DiffChip diff={kw.diff} /></td>
                <td className="px-3 py-2.5"><span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{kw.intent}</span></td>
                <td className="px-3 py-2.5 whitespace-nowrap"><PriorityChip priority={kw.pri} /></td>
                <td className="px-3 py-2.5 text-[11px] font-medium text-purple-700 break-words">{kw.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function KeywordsPanel({ data, domain }) {
  const KW = data.keywords || { primary: [], longtail: [], local: [], global: [] };
  const totalKw = Object.values(KW).flat().length;

  return (
    <div>
      <SectionHeader
        title={`SECTION 13: KEYWORD RECOMMENDATIONS — ${totalKw} Keywords`}
        sub="Primary Commercial, Long-Tail Informational, Local SEO, and Global/International"
      />

      {/* Exec summary */}
      <div className="relative bg-gradient-to-br from-red-50 to-white border-2 border-brand rounded-xl p-5 mb-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
        <div className="text-[11px] font-bold uppercase tracking-widest text-brand mb-3">
          📋 Execution Summary — Keyword Strategy for {domain}
        </div>
        <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
          {totalKw} keywords across 4 categories — all specific to {domain}'s niche, industry, and geography. Start with local keywords for fastest ROI.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">📌 Priority Keyword Gaps</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                `${(KW.primary || []).filter((k) => k.pri === "CRITICAL").length} CRITICAL primary keywords to target`,
                "Local keywords — fastest ROI, very low competition",
                "Long-tail informational — AEO/featured snippet opportunities",
                "Global B2B keywords for international reach",
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />{txt}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">✅ Keyword Action Plan</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                "Month 1-2: Target all local keywords — quick wins",
                "Month 2-4: Create content for long-tail informational keywords",
                "Month 4-6: Expand service pages for primary commercial keywords",
                "Month 6-9: Build international landing pages for global keywords",
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />{txt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <KwTable
        title={`C.1 — Primary Commercial Keywords (${(KW.primary || []).length} Keywords)`}
        desc="Highest-value keywords for driving qualified leads. High competition — winning requires strong domain authority and consistent link building."
        kwList={KW.primary}
      />
      <KwTable
        title={`C.2 — Long-Tail Informational Keywords (${(KW.longtail || []).length} Keywords)`}
        desc="Lower competition keywords targeting AEO/GEO gaps — FAQ sections, definition pages, and People Also Ask opportunities."
        kwList={KW.longtail}
      />
      <KwTable
        title={`C.3 — Local SEO Keywords (${(KW.local || []).length} Keywords)`}
        desc="Critical for driving nearby business enquiries. Very low competition and high commercial intent — fastest ROI opportunity."
        kwList={KW.local}
      />
      <KwTable
        title={`C.4 — Global & International Keywords (${(KW.global || []).length} Keywords)`}
        desc="Target international clients. Strong backlink profile gives the domain authority to compete globally."
        kwList={KW.global}
      />

      <div className="bg-gray-900 rounded-xl p-5 text-center mt-4">
        <div className="text-[14px] font-bold text-brand-light mb-1.5">{domain} — Complete Digital Marketing Strategy & Audit Report</div>
        <div className="text-[12px] text-gray-400">Powered by AI Seo-Auditor · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        <div className="text-[11px] text-gray-600 mt-1 italic">CONFIDENTIAL — For Internal Distribution Only.</div>
      </div>
    </div>
  );
}
