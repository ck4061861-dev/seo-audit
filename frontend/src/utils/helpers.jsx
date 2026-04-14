// ─── Score helpers ───────────────────────────────────────────────────────────
export const scCol = (s) => s >= 65 ? "#21bf6b" : s >= 45 ? "#f59e0b" : "#ef4444";
export const scBg  = (s) => s >= 65 ? "#dcfce7" : s >= 45 ? "#fef9c3" : "#fee2e2";
export const grade = (s) =>
  s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : s >= 50 ? "C" : s >= 40 ? "D" : "F";
export const gradeClass = (s) =>
  s >= 65 ? "grade-good" : s >= 45 ? "grade-ok" : "grade-bad";

export const gradeTailwind = (s) =>
  s >= 65
    ? "bg-green-100 text-green-700 border border-green-300"
    : s >= 45
    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
    : "bg-red-100 text-red-700 border border-red-300";

// ─── Status badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  if (status === "PASS")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">✓ PASS</span>;
  if (status === "WARN")
    return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">⚠ WARN</span>;
  return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">✕ FAIL</span>;
}

// ─── Priority chip ────────────────────────────────────────────────────────────
export function PriorityChip({ priority }) {
  const map = {
    CRITICAL: "text-red-700 bg-red-50",
    HIGH: "text-orange-700 bg-orange-50",
    MEDIUM: "text-yellow-700 bg-yellow-50",
    LOW: "text-gray-500 bg-gray-100",
  };
  return (
    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${map[priority] || map.LOW}`}>
      {priority}
    </span>
  );
}

// ─── Type chip ────────────────────────────────────────────────────────────────
export function TypeChip({ type }) {
  const map = {
    "Blog Post":       "bg-blue-100 text-blue-700",
    "Service Page":    "bg-orange-100 text-orange-700",
    "Case Study":      "bg-green-100 text-green-700",
    "Social Post":     "bg-cyan-100 text-cyan-700",
    "FAQ Page":        "bg-amber-100 text-amber-700",
    "Use Case Page":   "bg-purple-100 text-purple-700",
    "Definition Page": "bg-teal-100 text-teal-700",
    "Landing Page":    "bg-fuchsia-100 text-fuchsia-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${map[type] || map["Blog Post"]}`}>
      {type}
    </span>
  );
}

// ─── Owner chip ───────────────────────────────────────────────────────────────
export function OwnerChip({ owner }) {
  const map = {
    SEO:       "bg-orange-50 text-orange-700",
    Content:   "bg-purple-50 text-purple-700",
    Marketing: "bg-green-50 text-green-700",
  };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${map[owner] || map.SEO}`}>
      {owner}
    </span>
  );
}

// ─── Diff chip ────────────────────────────────────────────────────────────────
export function DiffChip({ diff }) {
  const map = {
    HIGH:   "text-red-700 bg-red-50",
    MEDIUM: "text-orange-700 bg-orange-50",
    LOW:    "text-green-700 bg-green-50",
  };
  return (
    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${map[diff] || map.LOW}`}>
      {diff}
    </span>
  );
}

// ─── Score chip ───────────────────────────────────────────────────────────────
export function ScoreChip({ score }) {
  const cls =
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 70 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${cls}`}>
      {score}/100 ({grade(score)})
    </span>
  );
}

// ─── SVG Gauge ────────────────────────────────────────────────────────────────
export function Gauge({ score, label, color }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center text-center bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">{label} Score</div>
      <div className="relative w-[88px] h-[88px] mb-2">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f3f7" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 leading-none">{score}</span>
          <span className="text-[10px] text-gray-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeTailwind(score)}`}>
        {grade(score)}
      </span>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, sub }) {
  return (
    <div className="bg-brand rounded-lg px-5 py-3.5 mb-5 mt-6 flex items-center justify-between flex-wrap gap-2">
      <h2 className="text-white font-bold text-base">{title}</h2>
      {sub && <span className="text-red-200 text-[11px]">{sub}</span>}
    </div>
  );
}
