"use client";

import { useState } from "react";

const PLANS = [
  {
    id:      "starter",
    name:    "Starter",
    price:   69,
    desc:    "Best for early-stage startups",
    features: [
      "5 compliance frameworks",
      "Up to 10 team members",
      "Control management",
      "Evidence collection",
      "PDF exports",
      "Slack & GitHub integrations",
      "Email support (48 h SLA)",
    ],
    cta:     "Start free trial",
    popular: false,
  },
  {
    id:      "pro",
    name:    "Pro",
    price:   179,
    desc:    "Best for growth-stage companies",
    features: [
      "Unlimited frameworks",
      "Up to 50 team members",
      "Advanced workflows",
      "Automated evidence collection",
      "PDF + CSV + scheduled reports",
      "AI Gap Analysis (GPT-4)",
      "Jira, AWS, GCP integrations",
      "Priority chat support (24 h SLA)",
    ],
    cta:     "Start free trial",
    popular: true,
  },
  {
    id:      "enterprise",
    name:    "Enterprise",
    price:   449,
    desc:    "Best for regulated industries",
    features: [
      "Unlimited everything",
      "Custom frameworks",
      "White-label reports",
      "SSO / SAML",
      "Full REST API access",
      "Immutable audit trail",
      "EU / US data residency",
      "Dedicated CSM + 4 h SLA",
      "99.9% uptime SLA",
    ],
    cta:     "Contact sales",
    popular: false,
  },
];

interface Props {
  currentPlan: string;
}

export function BillingPlans({ currentPlan }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === "enterprise") {
      window.location.href = "mailto:REPLACE_WITH_AURORA_RAYES_SALES_EMAIL?subject=Enterprise%20Plan%20Enquiry";
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl border p-6 flex flex-col ${
                plan.popular ? "border-indigo-500 shadow-md" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{plan.desc}</p>
                <div className="mt-3">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || loading === plan.id}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-gray-100 text-gray-500 cursor-default"
                    : plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {isCurrent ? "Current Plan" : loading === plan.id ? "Loading…" : plan.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}