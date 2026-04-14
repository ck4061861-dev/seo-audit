import React from "react";
import { SectionHeader, ScoreChip } from "../utils/helpers.jsx";
import { grade } from "../utils/helpers.jsx";

export default function StrategyPanel({ data, domain }) {
  const seo = data.mods.seo.score;
  const aeo = data.mods.aeo.score;
  const geo = data.mods.geo.score;
  const overall = data.overall;

  const allFails = ["seo", "aeo", "geo"].flatMap((k) =>
    data.mods[k].categories.flatMap((c) =>
      c.checks
        .filter((ch) => ch.status === "FAIL" || ch.status === "WARN")
        .map((ch) => ({ ...ch, module: k.toUpperCase() }))
    )
  );
  const critItems = allFails.filter((c) => c.priority === "CRITICAL").slice(0, 9);

  const phases = [
    {
      name: "Phase 1 — Months 1-3: Fix the Foundation",
      focus: "Technical fixes, on-page corrections, schema implementation, local SEO setup",
      headerBg: "bg-[#1a0000]", headerText: "text-white", accent: "#dc2626",
      items: critItems.slice(0, 9).map((c) => [
        c.action, c.module === "SEO" ? "Developer/SEO" : c.module === "AEO" ? "Content" : "Developer",
        c.priority === "CRITICAL" ? "Week 1" : "Week 2-3", `${c.module} fix`, "Immediate ranking impact",
      ]),
    },
    {
      name: "Phase 2 — Months 4-6: Authority & Content Build",
      focus: "Content cluster build, E-E-A-T trust signals, link acquisition, case studies",
      headerBg: "bg-[#451a03]", headerText: "text-white", accent: "#d97706",
      items: [
        ["Publish 6-month content calendar Weeks 1-4 content", "Content", "Month 4", "Content gap fix", "Featured snippets"],
        ["Launch use case pages for niche verticals", "SEO + Content", "Month 4-5", "GEO fix", "Niche traffic"],
        ["Publish 2 case studies with measurable results", "Marketing", "Month 4-5", "E-E-A-T fix", "Trust signals"],
        ["Build 10+ quality backlinks via guest posts and directories", "SEO", "Month 4-6", "Authority build", "+Domain Authority"],
        ["Add 10+ client testimonials and trust badges sitewide", "Marketing", "Month 4-5", "E-E-A-T fix", "Social proof"],
        [`Achieve ${Math.min(overall + 12, 99)}/100 overall audit score`, "All Teams", "Month 6", "Milestone", "Score benchmark"],
      ],
    },
    {
      name: "Phase 3 — Months 7-9: Scale & Brand Authority",
      focus: "International targeting, PR outreach, AI citation building, schema expansion",
      headerBg: "bg-[#064e3b]", headerText: "text-white", accent: "#10b981",
      items: [
        ["Create international landing pages for global keywords", "SEO + Dev", "Month 7", "Global keywords", "International leads"],
        ["Publish 3 more case studies for E-E-A-T depth", "Marketing", "Month 7-8", "E-E-A-T fix", "Trust authority"],
        ["Expand schema to HowTo and QAPage on all eligible content", "Developer", "Month 7", "AEO fix", "Rich results expansion"],
        ["Launch link building campaign: target DA60+ referral domains", "SEO", "Month 7-9", "Authority build", "+10 referring domains"],
        ["Press outreach: 3-5 media mentions or guest articles", "Marketing", "Month 7-9", "Domain authority", "+3 DA60+ links"],
      ],
    },
    {
      name: "Phase 4 — Months 10-12: Dominate & Sustain",
      focus: "Top 3 keyword push, brand authority consolidation, 2027 AI search preparation",
      headerBg: "bg-[#2e1065]", headerText: "text-white", accent: "#8b5cf6",
      items: [
        ["Content refresh: update all 2026 blog posts for 2027 accuracy", "Content", "Month 10-11", "Freshness signal", "All posts refreshed"],
        ["Push top 10 primary keywords toward Top 3 via link building", "SEO", "Months 10-12", "Revenue-driving", "5+ in Top 3"],
        ["Expand to 2 new niche verticals with dedicated pages", "SEO + Content", "Month 10", "Vertical authority", "2 new pages ranked"],
        [`Full re-audit: target ${Math.min(overall + 19, 99)}/100 overall score`, "SEO Lead", "Month 12", "Benchmark", `${Math.min(overall + 19, 99)}+ overall score`],
        ["2027 SEO predictions piece + strategy update", "Content + SEO", "Month 11-12", "Thought leadership", "Rank for 2027 keywords"],
      ],
    },
  ];

  return (
    <div>
      <SectionHeader title="SECTION 11: 12-MONTH SEO STRATEGY PLAN" sub="4 Phases: Fix Foundation → Authority → Scale → Dominate" />

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg px-4 py-3 mb-4 text-[13px] text-gray-700 leading-relaxed">
        This plan is structured into four quarterly phases. The goal is to fix all critical audit issues within 90 days, build authority over months 4–6, scale internationally in months 7–9, and consolidate{" "}
        <strong>{domain}</strong> as a top-ranked website in its niche by Month 12.
      </div>

      {/* Exec summary */}
      <div className="relative bg-gradient-to-br from-red-50 to-white border-2 border-brand rounded-xl p-5 mb-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
        <div className="text-[11px] font-bold uppercase tracking-widest text-brand mb-3">
          📋 Execution Summary — 12-Month Growth Roadmap for {domain}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">📌 Current Situation</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                `Overall ${overall}/100 — ${overall >= 75 ? "solid base" : "needs significant work"}`,
                `SEO ${seo}/100 — ${seo < 70 ? "critical gaps" : "needs improvement"}`,
                `AEO ${aeo}/100 — ${aeo < 75 ? "improvement needed" : "good foundation"}`,
                `GEO ${geo}/100 — AI search visibility ${geo < 70 ? "not optimized" : "partially optimized"}`,
                ...critItems.slice(0, 2).map((c) => `${c.n}: ${c.finding}`),
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />{txt}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">✅ 12-Month Targets</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                `Month 3: Fix all critical issues, ${Math.min(overall + 7, 99)}/100 overall score`,
                `Month 6: Content clusters built, ${Math.min(overall + 12, 99)}/100 overall`,
                "Month 9: International reach, brand in 10+ AI queries",
                `Month 12: ${Math.min(overall + 19, 99)}/100 overall, Top 3 for primary keywords`,
                "+150% organic traffic growth from Month 1 baseline",
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700 list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />{txt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Phases */}
      {phases.map((phase, pi) => (
        <div key={pi} className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className={`${phase.headerBg} ${phase.headerText} px-4 py-3 flex items-center justify-between flex-wrap gap-2`}>
            <div className="text-[14px] font-bold">{phase.name}</div>
            <div className="text-[11px] text-gray-400 italic">FOCUS: {phase.focus}</div>
          </div>
          <div className="table-scroll">
            <table className="w-full border-collapse" style={{ minWidth: 580 }}>
              <thead>
                <tr className="bg-gray-50">
                  {["Deliverable", "Owner", "Timeline", "Audit Fix", "Expected Impact"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-2 border-b border-gray-200 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {phase.items.map((item, ii) => (
                  <tr key={ii} className={`border-b border-gray-100 last:border-0 ${ii % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-3 py-2.5 text-[12px] font-medium text-gray-900">{item[0]}</td>
                    <td className="px-3 py-2.5 text-[12px] text-gray-500 whitespace-nowrap">{item[1]}</td>
                    <td className="px-3 py-2.5 text-[12px] text-gray-500 whitespace-nowrap">{item[2]}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: phase.accent + "22", color: phase.accent }}>{item[3]}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-green-700 font-medium">{item[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* 12-month projection */}
      <div className="text-sm font-bold text-gray-900 mb-3 mt-6">12-Month Score Projection</div>
      <div className="table-scroll">
        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden mb-5" style={{ minWidth: 520 }}>
          <thead>
            <tr className="bg-brand">
              {["Module", "Now", "Month 3", "Month 6", "Month 9", "Month 12 Target"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-white px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "SEO", score: seo, plus: [9, 14, 18, 22] },
              { label: "AEO", score: aeo, plus: [6, 10, 13, 16] },
              { label: "GEO", score: geo, plus: [8, 13, 17, 20] },
              { label: "OVERALL", score: overall, plus: [7, 12, 16, 19], bold: true },
            ].map((row) => (
              <tr key={row.label} className={`border-b border-gray-100 last:border-0 ${row.bold ? "bg-gray-50 font-bold" : ""}`}>
                <td className="px-3 py-2.5 text-[12px] text-gray-900">{row.label}</td>
                <td className="px-3 py-2.5"><ScoreChip score={row.score} /></td>
                <td className="px-3 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{Math.min(row.score + row.plus[0], 99)}/100</span></td>
                <td className="px-3 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">{Math.min(row.score + row.plus[1], 99)}/100</span></td>
                <td className="px-3 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">{Math.min(row.score + row.plus[2], 99)}/100</span></td>
                <td className="px-3 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-900 text-white">{Math.min(row.score + row.plus[3], 99)}/100 ({grade(row.score + row.plus[3])})</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
