import { createClient } from "@/lib/supabase/server";

const STATUS_BADGE: Record<string, string> = {
  upcoming:  "bg-blue-100 text-blue-800",
  active:    "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

export default async function AuditsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("org_id", user?.user_metadata?.org_id)
    .order("scheduled_at", { ascending: true });

  const upcoming  = audits?.filter((a) => a.status === "upcoming")  ?? [];
  const active    = audits?.filter((a) => a.status === "active")    ?? [];
  const completed = audits?.filter((a) => a.status === "completed") ?? [];

  const Section = ({ title, items }: { title: string; items: typeof audits }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      {items && items.length > 0 ? (
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Audit Name", "Auditor", "Framework", "Scheduled", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{a.name}</td>
                <td className="px-6 py-4 text-gray-600">{a.auditor}</td>
                <td className="px-6 py-4 text-gray-600">{a.framework_name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[a.status] ?? ""}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="px-6 py-4 text-sm text-gray-400">None.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Schedule</h1>
          <p className="text-gray-500 mt-1">Track upcoming, active, and completed audits.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Schedule Audit
        </button>
      </div>
      <Section title="Active" items={active} />
      <Section title="Upcoming" items={upcoming} />
      <Section title="Completed" items={completed} />
    </div>
  );
}