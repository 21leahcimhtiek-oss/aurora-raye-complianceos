const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high:     "bg-orange-100 text-orange-800",
  medium:   "bg-yellow-100 text-yellow-800",
  low:      "bg-blue-100 text-blue-800",
};

const STATUS_STYLES: Record<string, string> = {
  open:        "bg-red-50 text-red-700",
  in_progress: "bg-yellow-50 text-yellow-700",
  resolved:    "bg-green-50 text-green-700",
};

interface Props {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
  assignee?: string;
  dueDate?: string;
}

export function FindingCard({ id, title, severity, status, assignee, dueDate }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${SEVERITY_STYLES[severity] ?? ""}`}>
        {severity.toUpperCase()}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {assignee && <p className="text-xs text-gray-500">Assigned to {assignee}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {dueDate && (
          <span className="text-xs text-gray-400">
            Due {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? ""}`}>
          {status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}