"use client";

import { useState } from "react";

const REPORT_TYPES = [
  { id: "soc2",    label: "SOC 2 Readiness Report",    description: "Full control matrix with evidence status" },
  { id: "iso",     label: "ISO 27001 Gap Report",       description: "Gaps vs Annex A controls" },
  { id: "hipaa",   label: "HIPAA Risk Assessment",      description: "Administrative, physical, technical safeguards" },
  { id: "gdpr",    label: "GDPR Compliance Summary",    description: "Article-by-article compliance status" },
  { id: "exec",    label: "Executive Summary",          description: "Board-level one-page compliance overview" },
  { id: "full",    label: "Full Compliance Report",     description: "All frameworks, all controls, all findings" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const generate = async (id: string, format: "pdf" | "csv") => {
    setGenerating(`${id}-${format}`);
    await new Promise((r) => setTimeout(r, 2000)); // simulate generation
    setGenerating(null);
    alert(`${format.toUpperCase()} report generated! Check your email.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
        <p className="text-gray-500 mt-1">Generate and download audit-ready reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TYPES.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">{r.label}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">{r.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => generate(r.id, "pdf")}
                disabled={generating === `${r.id}-pdf`}
                className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating === `${r.id}-pdf` ? "Generating…" : "⬇ PDF"}
              </button>
              <button
                onClick={() => generate(r.id, "csv")}
                disabled={generating === `${r.id}-csv`}
                className="flex-1 bg-white text-gray-700 text-sm font-medium py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                {generating === `${r.id}-csv` ? "Generating…" : "⬇ CSV"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Scheduled Reports</h2>
        <p className="text-sm text-gray-500">
          Configure weekly or monthly automated report delivery to your email. Available on Pro and Enterprise plans.
        </p>
        <button className="mt-4 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Schedule Report
        </button>
      </div>
    </div>
  );
}