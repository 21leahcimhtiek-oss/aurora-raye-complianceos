const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  compliant:     { label: "Compliant",     cls: "bg-green-100 text-green-800" },
  partial:       { label: "Partial",       cls: "bg-yellow-100 text-yellow-800" },
  non_compliant: { label: "Non-Compliant", cls: "bg-red-100 text-red-800" },
};

interface Props {
  id: string;
  title: string;
  description?: string;
  status: "compliant" | "partial" | "non_compliant";
  evidenceCount: number;
}

export function ControlCard({ id, title, description, status, evidenceCount }: Props) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["non_compliant"];

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-400">{evidenceCount} evidence</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
          {s.label}
        </span>
      </div>
    </div>
  );
}