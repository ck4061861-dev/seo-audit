import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { grade, gradeTailwind, scCol, scBg, SectionHeader } from "../utils/helpers.jsx";
import { StatusBadge, PriorityChip } from "../utils/helpers.jsx";

function ExecSummary({ mod }) {
  const allC = mod.categories.flatMap((c) => c.checks);
  const fails = allC.filter((c) => c.status === "FAIL");
  const warns = allC.filter((c) => c.status === "WARN");
  const topFails = fails.filter((c) => c.priority === "CRITICAL" || c.priority === "HIGH").slice(0, 8);
  const topFixes = [...fails, ...warns].filter((c) => c.priority === "CRITICAL" || c.priority === "HIGH").slice(0, 8);
  const totF = fails.length, totW = warns.length, totP = allC.filter((c) => c.status === "PASS").length;

  const whatMap = {
    SEO: `This section evaluates ${allC.length} technical and content signals that determine how well your website ranks on Google. It covers ${mod.categories.length} categories. The overall SEO score is ${mod.score}/100 (Grade ${grade(mod.score)}).`,
    AEO: `This section evaluates how well your website is optimized for AI-powered answer engines — Google's People Also Ask, Featured Snippets, and voice search. AEO score is ${mod.score}/100 (Grade ${grade(mod.score)}).`,
    GEO: `This section evaluates your website's visibility inside AI-powered tools like ChatGPT, Google AI Overview, Perplexity and Bing Copilot. GEO score is ${mod.score}/100 (Grade ${grade(mod.score)}).`,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 mb-3">
        Execution Summary — What Is Happening & What To Do
      </div>
      <p className="text-[13px] text-gray-700 leading-relaxed mb-4">{whatMap[mod.label]}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">⚠️ Current Problems Identified</h3>
          <ul className="flex flex-col gap-1.5">
            {topFails.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                {c.n} — {c.finding}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">✅ Improvements To Make</h3>
          <ul className="flex flex-col gap-1.5">
            {topFixes.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                {c.n}: {c.action}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold leading-none" style={{ color: scCol(mod.score) }}>{mod.score}</span>
          <div>
            <div className="text-sm font-bold text-gray-900">{mod.label} Health Score</div>
            <div className="text-[11px] text-gray-500">Grade: {grade(mod.score)} · {totF} errors · {totW} warnings · {totP} passed</div>
          </div>
        </div>
        <span className="text-[11px] text-gray-400 italic">Click any category below to expand details</span>
      </div>
    </div>
  );
}

function CategorySection({ cat }) {
  const [open, setOpen] = useState(false);
  const catF = cat.checks.filter((c) => c.status === "FAIL").length;
  const catW = cat.checks.filter((c) => c.status === "WARN").length;
  const catP = cat.checks.filter((c) => c.status === "PASS").length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3.5">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex-wrap gap-2"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-[15px] font-bold text-gray-900">{cat.sectionNum} {cat.name}</h3>
          <span
            className="text-xs font-bold px-3 py-0.5 rounded-full"
            style={{ background: scBg(cat.score), color: scCol(cat.score) }}
          >
            {cat.score}/100 ({grade(cat.score)})
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-[11px]">
            <span className="text-green-600 font-semibold">✓ {catP} passed</span>
            <span className="text-yellow-600 font-semibold">⚠ {catW} warnings</span>
            <span className="text-red-600 font-semibold">✕ {catF} errors</span>
          </div>
          <span className={`text-gray-400 text-[11px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
        </div>
      </div>

      {cat.intro && open && (
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-[12px] text-gray-600 italic leading-relaxed">
          {cat.intro}
        </div>
      )}

      {open && (
        <div className="table-scroll">
          <table className="w-full border-collapse" style={{ minWidth: 660 }}>
            <thead>
              <tr className="bg-gray-50">
                {["Check", "Status", "Finding", "Priority", "Action Required"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-3 py-2 border-b border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cat.checks.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2.5 w-40">
                    <div className="text-[12px] font-semibold text-gray-900">{c.n}</div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-gray-800 font-medium leading-snug">{c.finding}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <PriorityChip priority={c.priority} />
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-gray-700 leading-snug">{c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ModulePanel({ mod, sectionNum }) {
  const navigate = useNavigate();
  const allC = mod.categories.flatMap((c) => c.checks);
  const totF = allC.filter((c) => c.status === "FAIL").length;
  const totW = allC.filter((c) => c.status === "WARN").length;
  const totP = allC.filter((c) => c.status === "PASS").length;

  return (
    <div>
      <div className="mb-4">
        <SectionHeader
          title={`SECTION ${sectionNum}: ${mod.label} ANALYSIS — Detailed Findings`}
          sub={`${allC.length} checks · Score: ${mod.score}/100 · Grade: ${grade(mod.score)}`}
        />
      </div>

      {mod.intro && (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 text-[13px] text-gray-700 leading-relaxed">
          {mod.intro}
        </div>
      )}

      <ExecSummary mod={mod} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: `${mod.label} Score`, val: mod.score, sub: `${grade(mod.score)} — ${mod.score >= 70 ? "Good Foundation" : mod.score >= 60 ? "Needs Work" : "Critical Issues"}`, color: mod.color },
          { label: "Errors", val: totF, sub: "Critical issues to fix", color: "#ef4444", pct: (totF / allC.length) * 100 },
          { label: "Warnings", val: totW, sub: "Improvements needed", color: "#f59e0b", pct: (totW / allC.length) * 100 },
          { label: "Passed", val: totP, sub: "Checks passing", color: "#21bf6b", pct: (totP / allC.length) * 100 },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{s.label}</div>
            <div className="text-3xl font-bold leading-none mt-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[11px] text-gray-400 mt-1">{s.sub}</div>
            {s.pct !== undefined && (
              <div className="h-0.5 bg-gray-100 rounded mt-2 overflow-hidden">
                <div className="h-full rounded" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-3">Category Breakdown — Click to Expand Details</h3>
      {mod.categories.map((cat, i) => <CategorySection key={i} cat={cat} />)}
    </div>
  );
}


export default ModulePanel;