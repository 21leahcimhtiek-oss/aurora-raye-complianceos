import { createClient } from "@/lib/supabase/server";
import { FindingCard } from "@/components/FindingCard";

const SEVERITY_ORDER = ["critical", "high", "medium", "low"];

export default async function FindingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("org_id", user?.user_metadata?.org_id)
    .order("created_at", { ascending: false });

  const open       = findings?.filter((f) => f.status === "open")        ?? [];
  const inProgress = findings?.filter((f) => f.status === "in_progress") ?? [];
  const resolved   = findings?.filter((f) => f.status === "resolved")    ?? [];

  const sortBySeverity = (arr: typeof findings) =>
    [...(arr ?? [])].sort(
      (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Findings</h1>
          <p className="text-gray-500 mt-1">Track and resolve compliance findings.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + New Finding
        </button>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: findings?.filter((f) => f.severity === "critical").length ?? 0, color: "text-red-600" },
          { label: "High",     count: findings?.filter((f) => f.severity === "high").length     ?? 0, color: "text-orange-600" },
          { label: "Medium",   count: findings?.filter((f) => f.severity === "medium").length   ?? 0, color: "text-yellow-600" },
          { label: "Low",      count: findings?.filter((f) => f.severity === "low").length      ?? 0, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Open findings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Open <span className="text-gray-400 font-normal">({open.length})</span>
        </h2>
        <div className="space-y-3">
          {sortBySeverity(open).map((f) => (
            <FindingCard key={f.id} id={f.id} title={f.title} severity={f.severity} status={f.status} assignee={f.assignee} dueDate={f.due_date} />
          ))}
          {open.length === 0 && <p className="text-sm text-gray-400">No open findings. 🎉</p>}
        </div>
      </div>

      {/* In-progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          In Progress <span className="text-gray-400 font-normal">({inProgress.length})</span>
        </h2>
        <div className="space-y-3">
          {sortBySeverity(inProgress).map((f) => (
            <FindingCard key={f.id} id={f.id} title={f.title} severity={f.severity} status={f.status} assignee={f.assignee} dueDate={f.due_date} />
          ))}
          {inProgress.length === 0 && <p className="text-sm text-gray-400">None in progress.</p>}
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Resolved <span className="text-gray-400 font-normal">({resolved.length})</span>
        </h2>
        <div className="space-y-3">
          {sortBySeverity(resolved).map((f) => (
            <FindingCard key={f.id} id={f.id} title={f.title} severity={f.severity} status={f.status} assignee={f.assignee} dueDate={f.due_date} />
          ))}
          {resolved.length === 0 && <p className="text-sm text-gray-400">No resolved findings yet.</p>}
        </div>
      </div>
    </div>
  );
}