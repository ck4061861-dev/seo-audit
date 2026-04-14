import React from "react";
import { SectionHeader } from "../utils/helpers.jsx";

function Stars({ n, color }) {
  return (
    <span style={{ color, letterSpacing: 2, fontSize: 13 }}>
      {"●".repeat(Math.min(n, 5))}{"○".repeat(Math.max(0, 5 - n))}
    </span>
  );
}

export default function CompetitorsPanel({ data, domain }) {
  const COMPETITORS = data.competitors || [];

  return (
    <div>
      <SectionHeader
        title={`SECTION 12: COMPETITOR ANALYSIS`}
        sub={`${COMPETITORS.length} key competitors analyzed`}
      />

      {/* Exec summary */}
      <div className="relative bg-gradient-to-br from-red-50 to-white border-2 border-brand rounded-xl p-5 mb-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
        <div className="text-[11px] font-bold uppercase tracking-widest text-brand mb-3">
          📋 Execution Summary — Competitive Landscape
        </div>
        <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
          {COMPETITORS.length} competitors analyzed across SEO, AEO, and GEO strength — specific to {domain}'s industry and market.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">📌 Competitor Weaknesses</h3>
            <ul className="flex flex-col gap-1.5">
              {COMPETITORS.slice(0, 4).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  <strong>{c.name}</strong> — {c.weaknesses?.split(",")[0] || "Limited AEO/GEO focus"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">✅ {domain} Opportunities</h3>
            <ul className="flex flex-col gap-1.5">
              {COMPETITORS.slice(0, 4).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                  {c.opp || "Leverage AEO/GEO advantage"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Overview table */}
      <h3 className="text-base font-bold text-gray-900 mb-3">Competitor Overview Snapshot</h3>
      <div className="table-scroll mb-5">
        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minWidth: 640 }}>
          <thead>
            <tr className="bg-brand">
              {["Agency", "Est.", "Team", "HQ", "SEO Str.", "AEO Str.", "GEO Str.", "Pricing/mo"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-white px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map((c, i) => (
              <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-3 py-2.5">
                  <div className="text-[12px] font-bold text-gray-900">{c.name}</div>
                  <div className="text-[10px] text-gray-400">{c.domain}</div>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-gray-600">{c.est}</td>
                <td className="px-3 py-2.5 text-[12px] text-gray-600">{c.team}</td>
                <td className="px-3 py-2.5 text-[12px] text-gray-600">{c.hq}</td>
                <td className="px-3 py-2.5"><Stars n={c.seo} color="#ff642d" /></td>
                <td className="px-3 py-2.5"><Stars n={c.aeo} color="#10b981" /></td>
                <td className="px-3 py-2.5"><Stars n={c.geo} color="#8b5cf6" /></td>
                <td className="px-3 py-2.5 text-[12px] font-medium text-gray-900">{c.pricing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed profiles */}
      <h3 className="text-base font-bold text-gray-900 mb-3">Detailed Competitor Profiles</h3>
      {COMPETITORS.map((c, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
          <div className="bg-brand px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-[13px] font-bold text-white">{i + 1}. {c.name} ({c.domain})</h3>
            <span className="text-[11px] text-red-200">Clutch: {c.clutch} · Est. {c.est} · Team: {c.team} · {c.market}</span>
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {[
                ["HQ / Market", `${c.hq} | ${c.market} | Est. ${c.est} | Team: ${c.team}`],
                ["Pricing", `${c.pricing} | Clutch: ${c.clutch}`],
                ["Strengths", c.strengths],
                ["Weaknesses", c.weaknesses],
                ["Our Opportunity", c.opp],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="px-3.5 py-2 bg-gray-50 text-[12px] font-semibold text-gray-900 whitespace-nowrap w-32">{label}</td>
                  <td className="px-3.5 py-2 text-[12px] text-gray-700 break-words">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Footer badge */}
      <div className="bg-gray-900 rounded-xl p-5 text-center mt-6">
        <div className="text-[14px] font-bold text-brand-light mb-1.5">{domain} — Complete Digital Marketing Strategy & Audit Report</div>
        <div className="text-[12px] text-gray-400">Powered by AI Analysis · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        <div className="text-[11px] text-gray-600 mt-1 italic">CONFIDENTIAL — For Internal Distribution Only.</div>
      </div>
    </div>
  );
}
