import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ControlCard } from "@/components/ControlCard";

interface Props {
  params: { id: string };
}

export default async function FrameworkDetailPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: framework } = await supabase
    .from("frameworks")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!framework) notFound();

  const { data: controls } = await supabase
    .from("controls")
    .select("*, evidence:evidence(count)")
    .eq("framework_id", params.id)
    .eq("org_id", user?.user_metadata?.org_id)
    .order("sort_order", { ascending: true });

  const total = controls?.length ?? 0;
  const compliant = controls?.filter((c) => c.status === "compliant").length ?? 0;
  const pct = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{framework.name}</h1>
          <p className="text-gray-500 mt-1">Version {framework.version} · {total} controls · {pct}% compliant</p>
        </div>
        <form action="/api/ai/gap-analysis" method="post">
          <input type="hidden" name="framework_id" value={params.id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            ✨ Run AI Gap Analysis
          </button>
        </form>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Completion</span>
          <span className="text-sm font-medium text-gray-900">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <span className="text-green-600">{compliant} compliant</span>
          <span className="text-yellow-600">
            {controls?.filter((c) => c.status === "partial").length ?? 0} partial
          </span>
          <span className="text-red-600">
            {controls?.filter((c) => c.status === "non_compliant").length ?? 0} non-compliant
          </span>
        </div>
      </div>

      {/* Controls list */}
      <div className="space-y-3">
        {controls?.map((control) => (
          <ControlCard
            key={control.id}
            id={control.id}
            title={control.title}
            description={control.description}
            status={control.status}
            evidenceCount={control.evidence?.[0]?.count ?? 0}
          />
        ))}
        {(!controls || controls.length === 0) && (
          <p className="text-sm text-gray-400">No controls found for this framework.</p>
        )}
      </div>
    </div>
  );
}