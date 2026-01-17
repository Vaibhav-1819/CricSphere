import React, { useMemo } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";

/* ---------------- Helpers ---------------- */

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function safeText(v) {
  return typeof v === "string" ? v : "";
}

function formatOver(v) {
  if (typeof v === "number") return v.toFixed(1);
  if (typeof v === "string") return v;
  return "";
}

function formatTime(ts) {
  if (!ts) return "";
  const n = Number(ts);
  if (!Number.isFinite(n)) return "";
  try {
    return new Date(n).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getEventType(item = {}) {
  const t = safeText(item?.eventtype).toUpperCase();
  if (t === "SIX") return "SIX";
  if (t === "FOUR") return "FOUR";
  if (t === "WICKET") return "WICKET";
  if (t.includes("WIDE")) return "WIDE";
  if (t.includes("NOBALL")) return "NOBALL";

  // fallback using comm text
  const text = safeText(item?.commtxt).toLowerCase();
  if (text.includes("six")) return "SIX";
  if (text.includes("four")) return "FOUR";
  if (text.includes("out") || text.includes("wicket")) return "WICKET";
  if (text.includes("wide")) return "WIDE";
  if (text.includes("no ball") || text.includes("noball")) return "NOBALL";

  return "NORMAL";
}

function badgeStyle(type) {
  switch (type) {
    case "WICKET":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "SIX":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "FOUR":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "WIDE":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "NOBALL":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-white/10";
  }
}

function cleanCricbuzzTokens(text = "") {
  // Removes tokens like B0$, B1$ that appear inside commtxt
  return safeText(text).replace(/B\d+\$/g, "").replace(/\s+/g, " ").trim();
}

function normalizeCommentary(raw) {
  // ✅ Your exact structure: { inningsid, comwrapper: [ { commentary: {...} } ] }
  const wrappers = safeArr(raw?.comwrapper);

  const items = wrappers
    .map((w) => w?.commentary)
    .filter(Boolean)
    .map((c, idx) => {
      const over = formatOver(c?.overnum);
      const text = cleanCricbuzzTokens(c?.commtxt);

      return {
        id: `${c?.inningsid ?? "inn"}-${c?.ballnbr ?? idx}-${over}`,
        over,
        text,
        ts: formatTime(c?.timestamp),
        eventType: getEventType(c),
        raw: c,
      };
    })
    .filter((x) => x.text.length > 0);

  return items;
}

/* ---------------- UI Components ---------------- */

const SectionCard = ({ children }) => (
  <div className="bg-white dark:bg-[#0b0f16] border border-black/10 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden">
    {children}
  </div>
);

const Header = () => (
  <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-blue-500/10">
        <MessageSquare className="text-blue-500" size={18} />
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Commentary
        </h3>
        <p className="text-[11px] font-semibold text-slate-500">
          Cricbuzz-style ball-by-ball feed
        </p>
      </div>
    </div>

    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
      Live
    </span>
  </div>
);

const OverTag = ({ over }) => (
  <div className="min-w-[58px] text-center">
    <span className="inline-flex px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-[10px] font-black text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10">
      {over || "—"}
    </span>
  </div>
);

const EventBadge = ({ type }) => (
  <span
    className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${badgeStyle(
      type
    )}`}
  >
    {type}
  </span>
);

const CommentaryRow = ({ item }) => {
  return (
    <div className="flex gap-4 px-6 py-4 border-b border-black/5 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
      <OverTag over={item.over} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <EventBadge type={item.eventType} />
          {item.ts ? (
            <span className="text-[10px] font-semibold text-slate-400">
              {item.ts}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {item.text}
        </p>
      </div>
    </div>
  );
};

/**
 * ✅ Use this like:
 * <CommentaryPanel commentaryData={commentaryData} />
 */
export default function CommentaryPanel({ commentaryData }) {
  const commentary = useMemo(() => {
    const items = normalizeCommentary(commentaryData);

    // Cricbuzz style: latest first
    return items.reverse();
  }, [commentaryData]);

  if (!commentary || commentary.length === 0) {
    return (
      <SectionCard>
        <Header />
        <div className="p-10 text-center">
          <AlertCircle className="mx-auto text-slate-300 mb-3" size={34} />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Commentary not available
          </p>
          <p className="text-[11px] text-slate-500 mt-2 max-w-md mx-auto">
            Commentary endpoint returned no items for this match.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <Header />
      <div className="max-h-[70vh] overflow-y-auto">
        {commentary.map((c) => (
          <CommentaryRow key={c.id} item={c} />
        ))}
      </div>
    </SectionCard>
  );
}
