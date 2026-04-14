import React from "react";
import { SectionHeader, ScoreChip, PriorityChip, StatusBadge } from "../utils/helpers.jsx";
import { grade } from "../utils/helpers.jsx";

export default function ActionPlanPanel({ data, domain }) {
  const allC = [];
  ["seo", "aeo", "geo"].forEach((k) =>
    data.mods[k].categories.forEach((cat) =>
      cat.checks
        .filter((c) => c.status !== "PASS")
        .forEach((c) => allC.push({ ...c, module: k.toUpperCase() }))
    )
  );
  allC.sort(
    (a, b) =>
      ["CRITICAL", "HIGH", "MEDIUM", "LOW"].indexOf(a.priority) -
      ["CRITICAL", "HIGH", "MEDIUM", "LOW"].indexOf(b.priority)
  );

  const criticals = allC.filter((c) => c.priority === "CRITICAL").length;
  const highs = allC.filter((c) => c.priority === "HIGH").length;

  const groups = [
    { key: "CRITICAL", label: "Critical Priority — Fix Within 2 Weeks", bg: "bg-red-50", border: "border-red-200", col: "text-red-700" },
    { key: "HIGH",     label: "High Priority — Fix Within 30 Days",      bg: "bg-orange-50", border: "border-orange-200", col: "text-orange-700" },
    { key: "MEDIUM",   label: "Medium Priority — Fix Within 60-90 Days", bg: "bg-yellow-50", border: "border-yellow-200", col: "text-yellow-700" },
    { key: "LOW",      label: "Low Priority",                            bg: "bg-gray-50",   border: "border-gray-200",  col: "text-gray-500" },
  ];

  const devTasks = allC.filter((c) => ["HTTPS / SSL","Viewport Meta Tag","Page Load Speed","TTFB (Time to First Byte)","Noindex Tags","Redirect Chains","Organization Schema","BreadcrumbList Schema","Open Graph Tags","Twitter Card Tags","Render-Blocking Resources","Image Optimization"].includes(c.n)).slice(0, 10);
  const contentTasks = allC.filter((c) => ["Title Tag","Meta Description","H1 Heading","Keyword in First 100 Words","Content Word Count","Definition Sections","FAQ Section","Last Updated Date","Direct Answer Paragraphs","Question-Based Headings"].includes(c.n)).slice(0, 8);
  const marketingTasks = allC.filter((c) => ["Trust Badges & Reviews","Google Business Profile","NAP Consistency","Social Proof / Testimonials","News & Press Mentions","Industry Directories","Brand Citability","Consistent Brand Name"].includes(c.n)).slice(0, 7);

  let num = 1;

  return (
    <div>
      <SectionHeader
        title={`SECTION 5: PRIORITIZED ACTION PLAN — All ${allC.length} Actions`}
        sub="Critical (2 weeks) · High (30 days) · Medium (60-90 days)"
      />

      {/* Exec summary */}
      <div className="relative bg-gradient-to-br from-red-50 to-white border-2 border-brand rounded-xl p-5 mb-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
        <div className="text-[11px] font-bold uppercase tracking-widest text-brand mb-3">📋 Execution Summary — Your Complete Fix List</div>
        <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
          Below is every issue from the audit organized by priority. Fix Critical items within 2 weeks — they are actively hurting your rankings right now.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">🔴 What's Broken Right Now</h3>
            <ul className="flex flex-col gap-1.5">
              <li className="flex items-start gap-1.5 text-[12px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />{criticals} Critical issues blocking rankings immediately</li>
              <li className="flex items-start gap-1.5 text-[12px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />{highs} High priority issues reducing search visibility daily</li>
              {allC.filter((c) => c.priority === "CRITICAL").slice(0, 3).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />{c.n} — {c.finding}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">✅ What To Do & When</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                `Week 1-2: Developer sprint — fix all ${criticals} Critical technical items`,
                "Week 1-4: Content/SEO team address all High priority issues",
                "Month 1-2: Marketing team handles trust and brand items",
                "Month 2-3: Medium priority improvements for sustained growth",
                `Target: ${Math.min(data.overall + 9, 99)}/100 overall score within 30 days`,
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />{txt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Priority groups */}
      {groups.map((g) => {
        const items = allC.filter((c) => c.priority === g.key);
        if (!items.length) return null;
        return (
          <div key={g.key}>
            <div className={`${g.bg} border ${g.border} rounded-lg px-4 py-2.5 mb-2 mt-4`}>
              <span className={`text-[13px] font-bold ${g.col}`}>{g.label}</span>
              <span className="text-[11px] text-gray-400 ml-2">({items.length} issues)</span>
            </div>
            <div className="table-scroll mb-3">
              <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minWidth: 580 }}>
                <thead>
                  <tr className="bg-brand">
                    {["#", "Issue", "Module", "Priority", "Recommended Fix"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-white px-3 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => {
                    const modColors = {
                      SEO: { bg: "bg-orange-50", text: "text-orange-700" },
                      AEO: { bg: "bg-green-50",  text: "text-green-700"  },
                      GEO: { bg: "bg-purple-50", text: "text-purple-700" },
                    };
                    const mc = modColors[c.module] || modColors.SEO;
                    return (
                      <tr key={num} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2.5 text-[13px] font-bold" style={{ color: g.col.replace("text-", "") }}>{num++}</td>
                        <td className="px-3 py-2.5">
                          <div className="text-[12px] font-semibold text-gray-900">{c.n}</div>
                          <div className="text-[11px] text-gray-400">{c.finding}</div>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mc.bg} ${mc.text}`}>{c.module}</span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap"><PriorityChip priority={c.priority} /></td>
                        <td className="px-3 py-2.5 text-[12px] text-gray-700 leading-snug">{c.action}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Section 6 — Teams */}
      <SectionHeader title="SECTION 6: TEAM RESPONSIBILITIES & TIMELINE" sub="30/60-day targets by team" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { name: "Developer / Technical Team", bg: "bg-[#1e3a5f]", dot: "bg-blue-500", tasks: devTasks.map((c) => `${c.n}: ${c.action}`) },
          { name: "Content / SEO Team",         bg: "bg-[#7c2d12]", dot: "bg-orange-500", tasks: contentTasks.map((c) => `${c.n}: ${c.action}`) },
          { name: "Marketing / Brand Team",     bg: "bg-[#064e3b]", dot: "bg-emerald-500", tasks: marketingTasks.map((c) => `${c.n}: ${c.action}`) },
        ].map((team) => (
          <div key={team.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className={`${team.bg} text-white text-[13px] font-bold px-3.5 py-2.5`}>{team.name}</div>
            <div className="py-1.5">
              {(team.tasks.length > 0 ? team.tasks : ["Review audit findings and address relevant items"]).map((t, i) => (
                <div key={i} className="flex items-start gap-2 px-3.5 py-1.5 border-b border-gray-50 last:border-0 text-[12px] text-gray-700 leading-snug">
                  <div className={`w-1.5 h-1.5 rounded-full ${team.dot} mt-1 flex-shrink-0`} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Milestone targets */}
      <div className="text-base font-bold text-gray-900 mb-3">30/60-Day Score Milestone Targets</div>
      <div className="table-scroll mb-5">
        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minWidth: 480 }}>
          <thead>
            <tr className="bg-brand">
              {["Module", "Current Score", "30-Day Target", "60-Day Target"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-white px-3.5 py-2.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "SEO Overall", score: data.mods.seo.score },
              { label: "AEO Overall", score: data.mods.aeo.score },
              { label: "GEO Overall", score: data.mods.geo.score },
            ].map((row) => (
              <tr key={row.label} className="border-b border-gray-100">
                <td className="px-3.5 py-2.5 text-[12px] text-gray-900">{row.label}</td>
                <td className="px-3.5 py-2.5"><ScoreChip score={row.score} /></td>
                <td className="px-3.5 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{Math.min(row.score + 10, 99)}/100</span></td>
                <td className="px-3.5 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">{Math.min(row.score + 17, 99)}/100</span></td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td className="px-3.5 py-2.5 text-[12px] text-gray-900 font-bold">Overall Score</td>
              <td className="px-3.5 py-2.5"><ScoreChip score={data.overall} /></td>
              <td className="px-3.5 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{Math.min(data.overall + 9, 99)}/100</span></td>
              <td className="px-3.5 py-2.5"><span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">{Math.min(data.overall + 15, 99)}/100 ({grade(data.overall + 15)})</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 7 — Final notes */}
      <SectionHeader title="SECTION 7: FINAL NOTES & EXECUTIVE RECOMMENDATIONS" sub="Summary for leadership" />
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-[13px] text-gray-700 leading-relaxed">
        {domain} is performing at a {grade(data.overall)} level ({data.overall}/100) across all three dimensions of modern search visibility. The audit identified {criticals} critical issues and {highs} high-priority items that, when fixed, can meaningfully improve rankings and AI search visibility.
        <br /><br />
        Prioritize the technical items in the first two weeks — these have the highest immediate impact on rankings. Content and trust signal improvements in weeks 3–8 will compound the gains.
      </div>
      <div className="text-base font-bold text-gray-900 mb-3">4 Immediate Actions for Leadership</div>
      {[
        `Assign a developer sprint in the next 5-7 days focused exclusively on the ${criticals} critical technical items.`,
        "Schedule a content audit meeting where the SEO/content team reviews all pages missing FAQs, definitions, and trust signals.",
        "Begin collecting client testimonials and case study approvals from existing clients this week.",
        "Set a re-audit date 30 days from today to measure progress against the baseline scores in this report.",
      ].map((a, i) => (
        <div key={i} className="flex gap-3 items-start p-3.5 bg-white border border-gray-200 rounded-xl mb-2">
          <div className="w-7 h-7 bg-brand-light rounded-lg text-white text-[13px] font-bold grid place-items-center flex-shrink-0">{i + 1}</div>
          <div className="text-[13px] text-gray-700 leading-relaxed pt-0.5">{a}</div>
        </div>
      ))}
    </div>
  );
}
