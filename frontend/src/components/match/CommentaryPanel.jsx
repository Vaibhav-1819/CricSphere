import React, { useMemo } from "react";
import { MessageSquare, AlertCircle } from "lucide-react";

/* ---------------- Helpers ---------------- */

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function getEventType(text = "") {
  const t = text.toLowerCase();

  if (t.includes("six")) return "SIX";
  if (t.includes("four")) return "FOUR";
  if (t.includes("out") || t.includes("wicket")) return "WICKET";
  if (t.includes("wide")) return "WIDE";
  if (t.includes("no ball") || t.includes("noball")) return "NOBALL";
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

function normalizeCommentary(raw) {
  /**
   * We support multiple possible structures:
   * raw.commentaryList
   * raw.commLines
   * raw.data.commentaryList
   * raw?.commentary?.items
   */

  const list =
    raw?.commentaryList ||
    raw?.commLines ||
    raw?.commentary?.items ||
    raw?.data?.commentaryList ||
    raw?.data?.commLines ||
    raw?.data?.commentary?.items ||
    [];

  const arr = safeArr(list);

  // Convert to uniform shape
  return arr
    .map((c, idx) => {
      const over =
        c?.overNumber ??
        c?.o ??
        c?.over ??
        c?.ball ??
        c?.ballNbr ??
        "";

      const comm =
        c?.commText ||
        c?.commentary ||
        c?.text ||
        c?.message ||
        c?.eventText ||
        "";

      const timestamp =
        c?.timestamp ||
        c?.time ||
        c?.ts ||
        "";

      return {
        id: c?.id || c?.commId || `${idx}-${over}`,
        over,
        text: comm,
        ts: timestamp,
        raw: c,
      };
    })
    .filter((x) => x.text && x.text.trim().length > 0);
}

/* ---------------- UI Components ---------------- */

const SectionCard = ({ children }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
    {children}
  </div>
);

const Header = () => (
  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
  <div className="min-w-[54px] text-center">
    <span className="inline-flex px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
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
  const type = getEventType(item.text);

  return (
    <div className="flex gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-white/5 transition">
      <OverTag over={item.over} />

      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <EventBadge type={type} />
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

export default function CommentaryPanel({ match }) {
  const commentary = useMemo(() => {
    // Most APIs return commentary separately, but sometimes included inside match object
    const raw =
      match?.commentary ||
      match?.matchCommentary ||
      match?.commentaryData ||
      match;

    const items = normalizeCommentary(raw);

    // Latest first like Cricbuzz
    return items.reverse();
  }, [match]);

  if (!commentary || commentary.length === 0) {
    return (
      <SectionCard>
        <Header />
        <div className="p-10 text-center">
          <AlertCircle className="mx-auto text-slate-300 mb-3" size={34} />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Commentary not available yet
          </p>
          <p className="text-[11px] text-slate-500 mt-2 max-w-md mx-auto">
            Your backend match endpoint currently returns only matchInfo +
            matchScore.  
            Next we’ll add a backend route to fetch full ball-by-ball commentary.
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
