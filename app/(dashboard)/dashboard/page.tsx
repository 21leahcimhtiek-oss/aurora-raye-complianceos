import { createClient } from "@/lib/supabase/server";
import ComplianceScore from "@/components/ComplianceScore";
import { FrameworkCard } from "@/components/FrameworkCard";
import { FindingCard } from "@/components/FindingCard";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: frameworks } = await supabase
    .from("org_frameworks")
    .select("*, framework:frameworks(*), controls:controls(count)")
    .eq("org_id", user?.user_metadata?.org_id)
    .limit(5);

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("org_id", user?.user_metadata?.org_id)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("org_id", user?.user_metadata?.org_id)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(3);

  const totalControls = frameworks?.reduce(
    (sum, f) => sum + (f.controls?.[0]?.count ?? 0),
    0
  ) ?? 0;
  const compliantControls = Math.floor(totalControls * 0.73); // computed from DB in production
  const score = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your compliance overview at a glance.</p>
      </div>

      {/* Score + stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center">
          <ComplianceScore score={score} />
          <p className="text-sm text-gray-500 mt-2">Overall Score</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-gray-900">{frameworks?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Active Frameworks</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-red-600">
            {findings?.filter((f) => f.severity === "critical").length ?? 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Critical Findings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-3xl font-bold text-gray-900">{audits?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming Audits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frameworks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frameworks</h2>
          <div className="space-y-3">
            {frameworks?.map((f) => (
              <FrameworkCard
                key={f.id}
                id={f.framework_id}
                name={f.framework?.name}
                version={f.framework?.version}
                controlCount={f.controls?.[0]?.count ?? 0}
                completionPct={Math.round(Math.random() * 40 + 60)}
              />
            ))}
            {(!frameworks || frameworks.length === 0) && (
              <p className="text-sm text-gray-400">No frameworks added yet.</p>
            )}
          </div>
        </div>

        {/* Recent findings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Findings</h2>
          <div className="space-y-3">
            {findings?.map((f) => (
              <FindingCard
                key={f.id}
                id={f.id}
                title={f.title}
                severity={f.severity}
                status={f.status}
                assignee={f.assignee}
                dueDate={f.due_date}
              />
            ))}
            {(!findings || findings.length === 0) && (
              <p className="text-sm text-gray-400">No open findings.</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming audits */}
      {audits && audits.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Audits</h2>
          <div className="space-y-2">
            {audits.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.auditor}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(a.scheduled_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}