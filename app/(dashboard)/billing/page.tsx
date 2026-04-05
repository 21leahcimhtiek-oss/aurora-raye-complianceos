import { createClient } from "@/lib/supabase/server";
import { BillingPlans } from "@/components/BillingPlans";

export default async function BillingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("org_id", user?.user_metadata?.org_id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and usage.</p>
      </div>

      {subscription && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-indigo-600 capitalize">{subscription.plan ?? "Starter"}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Renews on {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {subscription.status}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Frameworks used</p>
              <p className="font-medium">{subscription.frameworks_used ?? 0} / {subscription.frameworks_limit ?? 5}</p>
            </div>
            <div>
              <p className="text-gray-500">Team members</p>
              <p className="font-medium">{subscription.members_used ?? 0} / {subscription.members_limit ?? 10}</p>
            </div>
          </div>
        </div>
      )}

      <BillingPlans currentPlan={subscription?.plan ?? "starter"} />
    </div>
  );
}