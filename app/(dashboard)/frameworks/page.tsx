import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FrameworkCard } from "@/components/FrameworkCard";

const AVAILABLE_FRAMEWORKS = [
  { id: "soc2",     name: "SOC 2 Type II",  version: "2017",  description: "AICPA Trust Services Criteria" },
  { id: "iso27001", name: "ISO 27001",       version: "2022",  description: "Information Security Management" },
  { id: "hipaa",    name: "HIPAA",           version: "2013",  description: "Health Insurance Portability & Accountability" },
  { id: "gdpr",     name: "GDPR",            version: "2018",  description: "General Data Protection Regulation" },
  { id: "pcidss",   name: "PCI-DSS",         version: "4.0",   description: "Payment Card Industry Data Security Standard" },
];

export default async function FrameworksPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orgFrameworks } = await supabase
    .from("org_frameworks")
    .select("framework_id, controls:controls(count), compliant:controls(count).eq(status, compliant)")
    .eq("org_id", user?.user_metadata?.org_id);

  const activeIds = new Set(orgFrameworks?.map((f) => f.framework_id) ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Frameworks</h1>
          <p className="text-gray-500 mt-1">Manage your active frameworks and run gap analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AVAILABLE_FRAMEWORKS.map((fw) => {
          const active = activeIds.has(fw.id);
          const orgFw = orgFrameworks?.find((o) => o.framework_id === fw.id);
          const total = orgFw?.controls?.[0]?.count ?? 0;
          const compliant = orgFw?.compliant?.[0]?.count ?? 0;
          const pct = total > 0 ? Math.round((compliant / total) * 100) : 0;

          return (
            <div key={fw.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
              <FrameworkCard
                id={fw.id}
                name={fw.name}
                version={fw.version}
                controlCount={total}
                completionPct={active ? pct : 0}
              />
              <p className="text-sm text-gray-500">{fw.description}</p>
              <div className="flex items-center gap-2 mt-auto">
                {active ? (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                    <Link
                      href={`/frameworks/${fw.id}`}
                      className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View controls →
                    </Link>
                    <form action="/api/frameworks" method="post">
                      <input type="hidden" name="framework_id" value={fw.id} />
                      <input type="hidden" name="_action" value="run_gap_analysis" />
                      <button
                        type="submit"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1"
                      >
                        Gap Analysis
                      </button>
                    </form>
                  </>
                ) : (
                  <form action="/api/frameworks" method="post" className="w-full">
                    <input type="hidden" name="framework_id" value={fw.id} />
                    <input type="hidden" name="_action" value="add" />
                    <button
                      type="submit"
                      className="w-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md px-4 py-2"
                    >
                      + Add Framework
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}