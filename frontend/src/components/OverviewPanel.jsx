import React from "react";
import { grade, gradeTailwind, scCol, Gauge, SectionHeader } from "../utils/helpers.jsx";

function TOC() {
  const sections = [
    { num: "1.0", title: "Executive Summary", desc: "Overall scores, key strengths, critical weaknesses" },
    { num: "2.0", title: "SEO Analysis — Detailed Findings", desc: "On-Page, Technical, Core Web Vitals, Mobile & UX, Backlinks, Local SEO" },
    { num: "3.0", title: "AEO Analysis — Answer Engine Optimization", desc: "Featured Snippets, Voice Search, Schema, E-E-A-T, NLP & Semantic" },
    { num: "4.0", title: "GEO Analysis — Generative Engine Optimization", desc: "LLM Content, Brand Citability, AI Coverage, Trust & Metadata" },
    { num: "5.0", title: "Prioritized Action Plan", desc: "Critical (2 weeks), High (30 days), Medium (60-90 days)" },
    { num: "6.0", title: "Team Responsibilities & Timeline", desc: "Developer, Content/SEO, and Marketing task breakdowns" },
    { num: "7.0", title: "Final Notes & Executive Recommendations", desc: "Summary for leadership" },
    { num: "8.0", title: "6-Month Content Calendar", desc: "Weekly breakdown by type, keyword & owner" },
    { num: "9.0", title: "12-Month SEO Strategy Plan", desc: "4 Phases: Fix Foundation → Authority → Scale → Dominate" },
    { num: "10.0", title: "Competitor Analysis", desc: "6 competitors analyzed across SEO, AEO, GEO" },
    { num: "11.0", title: "Keyword Recommendations", desc: "Primary, long-tail, local, and global keywords" },
  ];
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
      <div className="text-[13px] font-extrabold uppercase tracking-widest text-gray-900 mb-3 pb-2 border-b-2 border-brand">
        TABLE OF CONTENTS
      </div>
      {sections.map((s) => (
        <div key={s.num} className="flex gap-2.5 py-1.5 border-b border-dashed border-gray-200 last:border-0">
          <span className="text-xs font-bold text-brand min-w-[36px]">{s.num}</span>
          <span className="text-[12.5px] text-gray-700">
            <strong>{s.title}</strong>
            {s.desc && <span className="text-gray-400 ml-1 text-[11px]">— {s.desc}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OverviewPanel({ data, domain }) {
  const allC = ["seo", "aeo", "geo"].flatMap((k) =>
    data.mods[k].categories.flatMap((c) => c.checks)
  );
  const totF = allC.filter((c) => c.status === "FAIL").length;
  const totW = allC.filter((c) => c.status === "WARN").length;
  const totP = allC.filter((c) => c.status === "PASS").length;
  const { seo, aeo, geo } = { seo: data.mods.seo, aeo: data.mods.aeo, geo: data.mods.geo };
  const overall = data.overall;

  const strengths = allC.filter((c) => c.status === "PASS" && (c.priority === "CRITICAL" || c.priority === "HIGH")).slice(0, 5);
  const weaknesses = allC.filter((c) => c.status === "FAIL" && (c.priority === "CRITICAL" || c.priority === "HIGH")).slice(0, 5);

  return (
    <div>
      {/* Cover card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { num: "PART 1", title: "SEO / AEO / GEO", sub: "Audit Report", note: `${overall}/100 Overall | 89 Checks`, bg: "bg-[#0e94b6]" },
            { num: "PART 2", title: "Content Calendar", sub: "6-Month Plan", note: `${(data.calendar || []).reduce((a, m) => a + (m.items || []).length, 0)} Pieces`, bg: "bg-brand" },
            { num: "PART 3", title: "SEO Plan, Competitors", sub: "& Keywords", note: `12-Month Plan | ${(data.competitors || []).length} Competitors | ${Object.values(data.keywords || {}).flat().length} Keywords`, bg: "bg-[#32059c]" },
          ].map((p) => (
            <div key={p.num} className={`${p.bg} text-white px-5 py-4 border-r border-white/20 last:border-0`}>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{p.num}</div>
              <div className="text-[15px] font-bold mb-0.5">{p.title}</div>
              <div className="text-sm opacity-85 mb-1">{p.sub}</div>
              <div className="text-[10px] opacity-60 italic">{p.note}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-200">
          {[
            { val: totF, lbl: "Errors", col: "text-red-600" },
            { val: totW, lbl: "Warnings", col: "text-yellow-600" },
            { val: totP, lbl: "Passed", col: "text-green-600" },
            { val: allC.length, lbl: "Total Checks", col: "text-blue-600" },
          ].map((s) => (
            <div key={s.lbl} className="text-center py-3.5 border-r border-gray-200 last:border-0">
              <div className={`text-3xl font-bold leading-none mb-1 ${s.col}`}>{s.val}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="py-2 px-5 bg-gray-50 border-t border-gray-200 text-center text-[11px] text-gray-400">
          Audit completed · {domain} · {allC.length} checks · SEO + AEO + GEO · CONFIDENTIAL
        </div>
      </div>

      <TOC />

      <SectionHeader title="SECTION 1: EXECUTIVE SUMMARY" sub="Overall scores, key strengths, critical weaknesses" />

      {/* Overview para */}
      <div className="bg-white border-l-4 border-brand rounded-r-lg px-4 py-3 mb-5 text-[13px] text-gray-700 leading-relaxed">
        This report presents a comprehensive search visibility audit of <strong>{domain}</strong>, conducted on{" "}
        {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}. The audit evaluated{" "}
        {allC.length} individual checks across three modern search optimization disciplines.
        <br /><br />
        The website achieved an overall score of{" "}
        <strong>{overall}/100 (Grade {grade(overall)})</strong>, indicating{" "}
        {overall >= 80 ? "a strong foundation" : overall >= 70 ? "a solid foundation with clear and actionable gaps" : overall >= 60 ? "moderate performance with significant gaps" : "significant issues requiring immediate attention"}.
      </div>

      {/* Score summary table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
        <div className="grid grid-cols-4 bg-gray-900 px-4 py-2.5">
          {["Module", "Score", "Grade", "Status"].map((h) => (
            <div key={h} className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</div>
          ))}
        </div>
        {[
          { label: "SEO (Search Engine Optimization)", score: seo.score, color: "#ff642d", status: seo.score >= 80 ? "Strong" : seo.score >= 70 ? "Needs Improvement" : "Critical Issues" },
          { label: "AEO (Answer Engine Optimization)", score: aeo.score, color: "#10b981", status: aeo.score >= 80 ? "Good — Maintain" : "Good — Minor Gaps" },
          { label: "GEO (Generative Engine Optimization)", score: geo.score, color: "#8b5cf6", status: geo.score >= 80 ? "Good" : "Moderate Gaps" },
          { label: "Overall Score", score: overall, color: "#ff642d", status: overall >= 80 ? "Strong Foundation" : "Good Foundation", bold: true },
        ].map((row) => (
          <div key={row.label} className={`grid grid-cols-4 px-4 py-3 border-b border-gray-100 last:border-0 items-center ${row.bold ? "bg-gray-50 font-bold" : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-6 rounded" style={{ background: row.color }} />
              <span className="text-[13px] text-gray-900">{row.label}</span>
            </div>
            <span className="text-[13px] font-bold" style={{ color: scCol(row.score) }}>{row.score}/100</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${gradeTailwind(row.score)}`}>{grade(row.score)}</span>
            <span className="text-[12px] text-gray-500">{row.status}</span>
          </div>
        ))}
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Gauge score={seo.score} label="SEO" color="#ff642d" />
        <Gauge score={aeo.score} label="AEO" color="#10b981" />
        <Gauge score={geo.score} label="GEO" color="#8b5cf6" />
        <Gauge score={overall} label="Overall" color="#ff642d" />
      </div>

      {/* Strengths */}
      <div className="text-base font-bold text-gray-900 mb-3">Key Strengths</div>
      <div className="flex flex-col gap-2 mb-5">
        {strengths.length > 0 ? strengths.map((c, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-lg text-[13px] text-green-900">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
            {c.n} — {c.finding}
          </div>
        )) : (
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-lg text-[13px] text-green-900">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
            Review individual tabs for detailed strengths.
          </div>
        )}
      </div>

      {/* Weaknesses */}
      <div className="text-base font-bold text-gray-900 mb-3">Critical Weaknesses Requiring Immediate Action</div>
      <div className="flex flex-col gap-2 mb-5">
        {(weaknesses.length > 0 ? weaknesses : allC.filter((c) => c.status === "WARN").slice(0, 5)).map((c, i) => (
          <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-900">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
            {c.n} — {c.finding}
          </div>
        ))}
      </div>
    </div>
  );
}
